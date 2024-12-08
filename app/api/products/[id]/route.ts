import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import pool from '../../../lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File

    if (!name || !description || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle file upload
    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = Date.now() + '-' + image.name.replaceAll(' ', '_')
    const relativePath = `/products/${filename}`
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    await writeFile(absolutePath, buffer)

    // Save to database
    const [result] = await pool.query(
      'INSERT INTO products (name, description, image_url) VALUES (?, ?, ?)',
      [name, description, relativePath]
    )

    const [newProduct] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    )

    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (error) {
    console.error('Error saving product:', error)
    return NextResponse.json(
      { error: 'Failed to save product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File | null

    let imageUrl = null
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer())
      const filename = Date.now() + '-' + image.name.replaceAll(' ', '_')
      const relativePath = `/products/${filename}`
      const absolutePath = path.join(process.cwd(), 'public', relativePath)

      await writeFile(absolutePath, buffer)
      imageUrl = relativePath
    }

    if (imageUrl) {
      await pool.query(
        'UPDATE products SET name = ?, description = ?, image_url = ? WHERE id = ?',
        [name, description, imageUrl, params.id]
      )
    } else {
      await pool.query(
        'UPDATE products SET name = ?, description = ? WHERE id = ?',
        [name, description, params.id]
      )
    }

    const [updated] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [params.id]
    )

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}


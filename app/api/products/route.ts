import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import pool from '../../lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    await mkdir(uploadDir, { recursive: true })

    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File

    if (!name || !description || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save image file
    const buffer = Buffer.from(await image.arrayBuffer())
    const filename = Date.now() + '-' + image.name.replaceAll(' ', '_')
    const relativePath = `/uploads/products/${filename}`
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
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Failed to save product' },
      { status: 500 }
    )
  }
}


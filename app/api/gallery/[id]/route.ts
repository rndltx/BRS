import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface GalleryImage {
  id: string;
  title: string;
  image: string;
}

let galleryImages: GalleryImage[] = []

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads', 'gallery')

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const image = galleryImages.find(img => img.id === params.id)
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' }, 
        { status: 404 }
      )
    }
    return NextResponse.json(image)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const image = formData.get('image') as File | null

    if (!title && !image) {
      return NextResponse.json(
        { error: 'Title or image is required' },
        { status: 400 }
      )
    }

    const index = galleryImages.findIndex(img => img.id === params.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    let imagePath = galleryImages[index].image

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer())
      const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      imagePath = `/uploads/gallery/${filename}`
      const absolutePath = path.join(process.cwd(), 'public', imagePath)
      
      await fs.mkdir(path.dirname(absolutePath), { recursive: true })
      await fs.writeFile(absolutePath, buffer)

      const oldImagePath = path.join(process.cwd(), 'public', galleryImages[index].image)
      await fs.unlink(oldImagePath).catch(() => {})
    }

    galleryImages[index] = {
      ...galleryImages[index],
      title: title || galleryImages[index].title,
      image: imagePath,
    }

    return NextResponse.json(galleryImages[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const index = galleryImages.findIndex(img => img.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const deletedImage = galleryImages.splice(index, 1)[0]
    const imagePath = path.join(UPLOAD_DIR, path.basename(deletedImage.image))
    await fs.unlink(imagePath).catch(() => {})

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}


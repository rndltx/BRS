import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// This uses the same mock database as the main slideshow route
declare var slideshowImages: { id: string; url: string }[]

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  const index = slideshowImages.findIndex(image => image.id === id)

  if (index === -1) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }

  const deletedImage = slideshowImages.splice(index, 1)[0]

  // Delete the image file
  const imagePath = path.join(process.cwd(), 'public', deletedImage.url)
  await fs.unlink(imagePath).catch(() => {})

  return NextResponse.json({ message: 'Image deleted successfully' })
}


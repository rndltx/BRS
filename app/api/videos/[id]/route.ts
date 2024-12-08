import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// This uses the same mock database as the main videos route
declare var videos: { id: string; title: string; thumbnailUrl: string; videoUrl: string; views: number }[]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const video = videos.find(v => v.id === params.id)
  if (!video) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  }
  return NextResponse.json(video)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const formData = await request.formData()
  const title = formData.get('title') as string
  const thumbnail = formData.get('thumbnail') as File | null
  const video = formData.get('video') as File | null

  const index = videos.findIndex(v => v.id === params.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  }

  let thumbnailPath = videos[index].thumbnailUrl
  let videoPath = videos[index].videoUrl

  if (thumbnail) {
    const buffer = Buffer.from(await thumbnail.arrayBuffer())
    const filename = Date.now() + '-' + thumbnail.name.replaceAll(' ', '_')
    thumbnailPath = `/video-thumbnails/${filename}`
    const absolutePath = path.join(process.cwd(), 'public', thumbnailPath)
    await fs.writeFile(absolutePath, buffer)

    // Delete old thumbnail
    const oldThumbnailPath = path.join(process.cwd(), 'public', videos[index].thumbnailUrl)
    await fs.unlink(oldThumbnailPath).catch(() => {})
  }

  if (video) {
    const buffer = Buffer.from(await video.arrayBuffer())
    const filename = Date.now() + '-' + video.name.replaceAll(' ', '_')
    videoPath = `/videos/${filename}`
    const absolutePath = path.join(process.cwd(), 'public', videoPath)
    await fs.writeFile(absolutePath, buffer)

    // Delete old video
    const oldVideoPath = path.join(process.cwd(), 'public', videos[index].videoUrl)
    await fs.unlink(oldVideoPath).catch(() => {})
  }

  videos[index] = {
    ...videos[index],
    title: title || videos[index].title,
    thumbnailUrl: thumbnailPath,
    videoUrl: videoPath,
  }

  return NextResponse.json(videos[index])
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = videos.findIndex(v => v.id === params.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Video not found' }, { status: 404 })
  }

  const deletedVideo = videos.splice(index, 1)[0]

  // Delete thumbnail and video files
  const thumbnailPath = path.join(process.cwd(), 'public', deletedVideo.thumbnailUrl)
  const videoPath = path.join(process.cwd(), 'public', deletedVideo.videoUrl)
  await fs.unlink(thumbnailPath).catch(() => {})
  await fs.unlink(videoPath).catch(() => {})

  return NextResponse.json({ message: 'Video deleted successfully' })
}


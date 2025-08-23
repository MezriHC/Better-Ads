export interface VideoData {
  id: string
  title: string
  posterUrl: string
  videoUrl?: string
  status: "processing" | "ready" | "failed"
  progress?: number
  createdAt: string
  duration?: string
  format?: "16:9" | "9:16" | "1:1"
}

export interface VideoShowcaseProps {
  projectId?: string
  heroSection?: React.ReactNode
  onVideoPlay?: (video: VideoData) => void
}

export interface VideoGridProps {
  videos: VideoData[]
  onPlay?: (video: VideoData) => void
  onDownload?: (video: VideoData) => void
  onDelete?: (video: VideoData) => void
  onRename?: (video: VideoData) => void
  emptyMessage?: string
}

export interface VideoCardProps {
  video: VideoData
  onPlay?: (video: VideoData) => void
  onDownload?: (video: VideoData) => void
  onDelete?: (video: VideoData) => void
  onRename?: (video: VideoData) => void
}
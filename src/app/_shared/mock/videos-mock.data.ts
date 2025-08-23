import { VideoData } from '../config/video-types'

export const mockVideos: VideoData[] = [
  {
    id: "video-1",
    title: "Product Demo - Nike Shoes",
    posterUrl: "https://picsum.photos/400/225?random=1",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "ready",
    duration: "0:45",
    createdAt: "2024-01-15T10:00:00Z",
    format: "16:9"
  },
  {
    id: "video-2", 
    title: "AI Avatar Presentation",
    posterUrl: "https://picsum.photos/400/225?random=2",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "ready",
    duration: "1:23",
    createdAt: "2024-01-14T15:30:00Z",
    format: "16:9"
  },
  {
    id: "video-3",
    title: "Vertical Story",
    posterUrl: "https://picsum.photos/225/400?random=3", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "ready",
    duration: "0:30",
    createdAt: "2024-01-13T09:15:00Z",
    format: "9:16"
  },
  {
    id: "video-4",
    title: "Mobile First Video",
    posterUrl: "https://picsum.photos/225/400?random=4",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "ready",
    duration: "1:00",
    createdAt: "2024-01-12T16:45:00Z",
    format: "9:16"
  },
  {
    id: "video-5",
    title: "Square Social Post",
    posterUrl: "https://picsum.photos/400/400?random=5",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "ready",
    duration: "0:15",
    createdAt: "2024-01-11T14:20:00Z",
    format: "1:1"
  },
  {
    id: "video-6",
    title: "Instagram Square",
    posterUrl: "https://picsum.photos/400/400?random=6",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "ready",
    duration: "0:28",
    createdAt: "2024-01-10T11:30:00Z",
    format: "1:1"
  },
  {
    id: "video-7",
    title: "Marketing Campaign",
    posterUrl: "https://picsum.photos/400/225?random=7",
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z",
    format: "16:9"
  },
  {
    id: "video-8",
    title: "Story Generation",
    posterUrl: "https://picsum.photos/225/400?random=8",
    status: "processing",
    createdAt: "2024-01-16T16:45:00Z",
    format: "9:16"
  },
  {
    id: "video-9",
    title: "Square Ad",
    posterUrl: "https://picsum.photos/400/400?random=9",
    status: "processing",
    createdAt: "2024-01-16T18:30:00Z",
    format: "1:1"
  },
  {
    id: "video-10",
    title: "Horizontal Campaign",
    posterUrl: "https://picsum.photos/400/225?random=10",
    status: "failed",
    createdAt: "2024-01-12T11:30:00Z",
    format: "16:9"
  },
  {
    id: "video-11",
    title: "Vertical Story",
    posterUrl: "https://picsum.photos/225/400?random=11",
    status: "failed",
    createdAt: "2024-01-12T09:15:00Z",
    format: "9:16"
  }
]
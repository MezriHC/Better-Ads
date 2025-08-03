"use client"

import React, { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import { IconPlayerPlay, IconDownload, IconSearch } from "@tabler/icons-react"
import { FilterSelect } from "./components/FilterSelect"
import videosData from "./data/videos.json"

interface LibraryVideo {
  id: string
  title: string
  type: "Video Avatar" | "Product Avatar"
  thumbnail: string
  videoUrl: string
  createdAt: string
  duration: string
  status: "completed" | "processing" | "failed"
}

const libraryVideos = videosData as LibraryVideo[]

function VideoTitle({ title }: { title: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth)
    }
  }, [title])

  return (
    <div className="relative">
      <h3 
        ref={textRef}
        className="font-semibold text-card-foreground text-sm truncate"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {title}
      </h3>
      
      {/* Tooltip - seulement si le texte déborde ET si on hover */}
      {isOverflowing && isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg text-sm text-popover-foreground whitespace-nowrap z-20">
          {title}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
        </div>
      )}
    </div>
  )
}

export default function LibraryPage() {
  const [selectedVideo, setSelectedVideo] = useState<LibraryVideo | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "Video Avatar", label: "Video Avatar" },
    { value: "Product Avatar", label: "Product Avatar" }
  ]
  
  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ]
  
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "processing", label: "Processing" }
  ]
  
  const filteredVideos = useMemo(() => {
    return libraryVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === "all" || video.type === typeFilter
      const matchesStatus = statusFilter === "all" || video.status === statusFilter
      
      let matchesDate = true
      if (dateFilter !== "all") {
        const today = new Date()
        const videoDate = new Date(video.createdAt)
        
        switch (dateFilter) {
          case "today":
            matchesDate = videoDate.toDateString() === today.toDateString()
            break
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = videoDate >= weekAgo
            break
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
            matchesDate = videoDate >= monthAgo
            break
        }
      }
      
      return matchesSearch && matchesType && matchesDate && matchesStatus
    })
  }, [searchQuery, typeFilter, dateFilter, statusFilter])

  const openVideo = (video: LibraryVideo) => {
    if (video.status === "completed") {
      setSelectedVideo(video)
    }
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return "Today"
    } else if (diffDays === 2) {
      return "Yesterday"
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`
    } else if (diffDays <= 30) {
      const weeks = Math.floor((diffDays - 1) / 7)
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Library</h1>
          <p className="text-muted-foreground">Your generated videos and advertisements</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          
          {/* Filter dropdowns */}
          <div className="flex gap-3 flex-wrap">
            <FilterSelect
              label="Type"
              value={typeFilter}
              options={typeOptions}
              onChange={setTypeFilter}
            />
            <FilterSelect
              label="Date"
              value={dateFilter}
              options={dateOptions}
              onChange={setDateFilter}
            />
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
            />
          </div>
        </div>
      </div>



      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <IconPlayerPlay className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
          <p className="text-muted-foreground max-w-md">
            {searchQuery || typeFilter !== "all" || dateFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters or search query."
              : "Start creating your first video with Video Avatar or Product Avatar."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, calc((100% - 4rem) / 5)), 1fr))' }}>
          {filteredVideos.map((video) => (
            <div 
              key={video.id}
              className={`bg-card border border-border rounded-2xl overflow-hidden group relative ${
                video.status === "completed" ? "cursor-pointer" : "cursor-default"
              }`}
              onClick={() => openVideo(video)}
            >
              <div className="relative aspect-[9/16] overflow-hidden">
                <Image 
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    video.status === "completed" ? "group-hover:scale-105" : ""
                  }`}
                />
                
                {/* Status overlay */}
                {video.status === "processing" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs font-medium">Processing...</p>
                    </div>
                  </div>
                )}
                

                
                {/* Play button for completed videos */}
                {video.status === "completed" && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <IconPlayerPlay className="w-5 h-5 text-white" fill="currentColor" />
                      </div>
                    </div>
                  </>
                )}
                
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs font-medium">
                  {video.duration}
                </div>
                

              </div>
              
              <div className="p-3 flex flex-col gap-1">
                <VideoTitle title={video.title} />
                <p className="text-muted-foreground text-xs">{formatDate(video.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeVideo}>
          <div className="bg-card rounded-2xl overflow-hidden max-w-xs w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <video 
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-auto aspect-[9/16]"
              >
                Your browser does not support the video tag.
              </video>
              <button 
                onClick={closeVideo}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">{selectedVideo.title}</h2>
                <p className="text-muted-foreground text-sm">{formatDate(selectedVideo.createdAt)} • {selectedVideo.duration}</p>
              </div>
              
              {/* Download button */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                <IconDownload className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

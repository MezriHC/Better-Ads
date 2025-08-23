"use client"

import { IconMicrophone, IconPlayerPlay, IconPlayerPause, IconRefresh, IconTrash } from "@tabler/icons-react"

interface AudioRecordingInterfaceProps {
  recordedBlob: Blob | null
  audioFile: File | null
  isRecording: boolean
  isPlaying: boolean
  recordingState: "idle" | "ready" | "recording" | "completed"
  recordingTime: number
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
  onPauseRecording: () => void
  onRestartRecording: () => void
  onPrepareRecording: () => void
  onClearAudio: () => void
  onCancelRecording: () => void
  formatTime: (seconds: number) => string
}

export function AudioRecordingInterface({
  recordedBlob,
  audioFile,
  isRecording,
  isPlaying,
  recordingState,
  recordingTime,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onPauseRecording,
  onRestartRecording,
  onPrepareRecording,
  onClearAudio,
  onCancelRecording,
  formatTime
}: AudioRecordingInterfaceProps) {
  
  if (recordedBlob || audioFile) {
    // Recorded/Uploaded Audio - Compact
    return (
      <div className="w-full h-32 flex items-center gap-4 p-4 bg-muted border border-border rounded-lg">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <IconMicrophone className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">
            {recordedBlob ? "Recorded Audio" : audioFile?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Ready to use
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={isPlaying ? onPauseRecording : onPlayRecording}
            className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
          >
            {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
          </button>
          
          {recordedBlob && (
            <button
              onClick={onRestartRecording}
              className="w-8 h-8 flex items-center justify-center bg-background text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <IconRefresh size={16} />
            </button>
          )}
          
          <button
            onClick={onClearAudio}
            className="w-8 h-8 flex items-center justify-center bg-background text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <IconTrash size={16} />
          </button>
        </div>
      </div>
    )
  }

  if (isRecording) {
    // Recording in Progress - Compact
    return (
      <div className="w-full h-32 flex items-center gap-4 p-4 border-2 border-primary rounded-lg bg-primary/5">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <IconMicrophone className="w-5 h-5 text-primary" />
          </div>
          <div className="absolute inset-0 w-10 h-10 rounded-full bg-primary/30 animate-ping"></div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">Recording...</p>
          <p className="text-sm font-mono text-primary">{formatTime(recordingTime)}</p>
        </div>
        <button
          onClick={onStopRecording}
          className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          <IconPlayerPause className="w-4 h-4 mr-1 inline-block" />
          Stop
        </button>
      </div>
    )
  }

  if (recordingState === "ready") {
    // Ready to Record - Compact
    return (
      <div className="w-full h-32 flex items-center gap-4 p-4 border-2 border-primary rounded-lg bg-primary/5">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <IconMicrophone className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">Ready to Record</p>
          <p className="text-sm text-muted-foreground">Click Start when ready</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancelRecording}
            className="px-3 py-1.5 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onStartRecording}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm"
          >
            Start
          </button>
        </div>
      </div>
    )
  }

  // Record Button - Match textarea height
  return (
    <button
      onClick={onPrepareRecording}
      className="w-full h-32 p-4 bg-background border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer flex flex-col items-center justify-center gap-3"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
        <IconMicrophone className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
          Record Audio
        </p>
        <p className="text-sm text-muted-foreground">
          Click to start recording your voice
        </p>
      </div>
    </button>
  )
}
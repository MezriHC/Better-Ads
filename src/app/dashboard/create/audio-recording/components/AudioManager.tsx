"use client"

import { useState, useRef } from 'react'
import { IconPlayerPlay, IconPlayerPause, IconRefresh, IconTrash } from "@tabler/icons-react"
import { RecordButton } from './ui/RecordButton'
import { Button } from '@/src/app/_shared'

interface AudioManagerProps {
  audioFile: File | null
  recordedBlob: Blob | null
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

export function AudioManager({
  audioFile,
  recordedBlob,
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
}: AudioManagerProps) {
  const hasAudio = recordedBlob || audioFile

  const handleRecordClick = () => {
    if (recordingState === "idle") {
      onPrepareRecording()
    } else if (recordingState === "ready") {
      onStartRecording()
    } else if (recordingState === "recording") {
      onStopRecording()
    }
  }

  return (
    <div className="space-y-4">
      {recordingState === "idle" && (
        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Record your voice or upload an audio file
          </div>
          <RecordButton
            isRecording={isRecording}
            recordingState={recordingState}
            onClick={handleRecordClick}
          />
        </div>
      )}

      {recordingState === "ready" && (
        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Click to start recording
          </div>
          <div className="flex justify-center gap-2">
            <RecordButton
              isRecording={isRecording}
              recordingState={recordingState}
              onClick={handleRecordClick}
            />
            <Button
              variant="secondary"
              onClick={onCancelRecording}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {recordingState === "recording" && (
        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Recording... {formatTime(recordingTime)}
          </div>
          <RecordButton
            isRecording={isRecording}
            recordingState={recordingState}
            onClick={handleRecordClick}
          />
        </div>
      )}

      {recordingState === "completed" && hasAudio && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Recorded Audio</span>
            <span className="text-sm text-muted-foreground">
              {formatTime(recordingTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={isPlaying ? onPauseRecording : onPlayRecording}
              className="cursor-pointer"
            >
              {isPlaying ? <IconPlayerPause className="w-4 h-4" /> : <IconPlayerPlay className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="secondary"
              onClick={onRestartRecording}
              className="cursor-pointer"
            >
              <IconRefresh className="w-4 h-4" />
            </Button>
            
            <Button
              variant="destructive"
              onClick={onClearAudio}
              className="cursor-pointer"
            >
              <IconTrash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
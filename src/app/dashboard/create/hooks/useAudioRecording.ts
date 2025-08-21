







  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setRecordedBlob(blob)
        setAudioFile(new File([blob], 'recorded-audio.wav', { type: 'audio/wav' }))
        stream.getTracks().forEach(track => track.stop())
        setRecordingState("completed")
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingState("recording")
      setRecordingTime(0)
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {

      setRecordingState("idle")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (recordedBlob || audioFile) {
      const blob = recordedBlob || audioFile
      const url = URL.createObjectURL(blob!)
      const audio = new Audio(url)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(url)
      }
      
      audio.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const restartRecording = () => {
    setRecordedBlob(null)
    setAudioFile(null)
    setRecordingState("idle")
  }

  const clearAudio = () => {
    setAudioFile(null)
    setRecordedBlob(null)
    setRecordingState("idle")
  }

  const cancelRecording = () => {
    setRecordingState("idle")
  }

  return {
    // State
    recordedBlob,
    audioFile,
    isPlaying,
    isRecording,
    recordingState,
    recordingTime,
    
    // Actions
    prepareRecording,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    restartRecording,
    clearAudio,
    cancelRecording,
    setAudioFile,
    
    // Utils
    formatTime
  }
}

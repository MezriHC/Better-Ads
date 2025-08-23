import { IconUsers, IconVideo, IconPhotoVideo } from "@tabler/icons-react"
import type { CreationTypeOption, SpeechMode, VideoFormat, Voice } from "./types"

export const creationTypes: CreationTypeOption[] = [
  { id: "talking-actor", label: "Talking Actor", icon: IconUsers },
  { id: "b-rolls", label: "B-Rolls", icon: IconPhotoVideo },
]

export const speechModes: SpeechMode[] = [
  { id: "text-to-speech", label: "Text to Speech" },
  { id: "speech-to-speech", label: "Speech to Speech" },
]

export const videoFormats: VideoFormat[] = [
  { id: "16:9", label: "Horizontal", ratio: "16:9" },
  { id: "9:16", label: "Vertical", ratio: "9:16" },
  { id: "1:1", label: "Square", ratio: "1:1" },
]

export const voices: Voice[] = [
  { id: "1", name: "Carson", gender: "male", language: "English", country: "US", flag: "🇺🇸" },
  { id: "2", name: "Emma", gender: "female", language: "English", country: "US", flag: "🇺🇸" },
  { id: "3", name: "Charles", gender: "male", language: "English", country: "UK", flag: "🇬🇧" },
  { id: "4", name: "Sarah", gender: "female", language: "English", country: "AU", flag: "🇦🇺" },
  { id: "5", name: "Maria", gender: "female", language: "Spanish", country: "ES", flag: "🇪🇸" },
  { id: "6", name: "Pierre", gender: "male", language: "French", country: "FR", flag: "🇫🇷" },
  { id: "7", name: "Sophie", gender: "female", language: "French", country: "FR", flag: "🇫🇷" },
  { id: "8", name: "Hans", gender: "male", language: "German", country: "DE", flag: "🇩🇪" },
  { id: "9", name: "Isabella", gender: "female", language: "Italian", country: "IT", flag: "🇮🇹" },
  { id: "10", name: "Akira", gender: "male", language: "Japanese", country: "JP", flag: "🇯🇵" },
]

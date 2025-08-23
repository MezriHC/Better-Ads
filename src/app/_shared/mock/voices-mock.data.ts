/**
 * @purpose: Mock data voix pour validation UI cross-features
 * @domain: voice
 * @scope: global
 * @created: 2024-08-23
 */

export interface Voice {
  id: string
  name: string
  gender: "male" | "female" | "neutral"
  language: string
  country: string
  flag: string
}

export const mockVoices: Voice[] = [
  {
    id: "voice-1",
    name: "Emma",
    gender: "female",
    language: "English",
    country: "US",
    flag: "🇺🇸"
  },
  {
    id: "voice-2",
    name: "James",
    gender: "male", 
    language: "English",
    country: "UK",
    flag: "🇬🇧"
  },
  {
    id: "voice-3",
    name: "Sophie",
    gender: "female",
    language: "French", 
    country: "FR",
    flag: "🇫🇷"
  },
  {
    id: "voice-4",
    name: "Carlos",
    gender: "male",
    language: "Spanish",
    country: "ES", 
    flag: "🇪🇸"
  },
  {
    id: "voice-5",
    name: "Anna",
    gender: "female",
    language: "German",
    country: "DE",
    flag: "🇩🇪"
  },
  {
    id: "voice-6",
    name: "Marco",
    gender: "male",
    language: "Italian", 
    country: "IT",
    flag: "🇮🇹"
  }
]
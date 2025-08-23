import { DashboardMain } from "./components/DashboardMain"
import type { Avatar } from "./components/AvatarSlider"
import type { UGCVideo } from "./components/UGCShowcase"

const mockAvatars: Avatar[] = [
  {
    id: "1",
    name: "Emma",
    category: "Business",
    description: "Professional business avatar",
    tags: ["Professional", "Business"],
    imageUrl: "https://picsum.photos/220/288?random=1",
    type: "image",
    gender: "female"
  },
  {
    id: "2", 
    name: "James",
    category: "Casual",
    description: "Casual presenter avatar",
    tags: ["Casual", "Friendly"],
    imageUrl: "https://picsum.photos/220/288?random=2",
    type: "image",
    gender: "male"
  },
  {
    id: "3",
    name: "Sofia",
    category: "Creative",
    description: "Creative storyteller avatar",
    tags: ["Creative", "Storytelling"],
    imageUrl: "https://picsum.photos/220/288?random=3",
    type: "image",
    gender: "female"
  },
  {
    id: "4",
    name: "Marcus",
    category: "Tech",
    description: "Tech presenter avatar",
    tags: ["Tech", "Innovation"],
    imageUrl: "https://picsum.photos/220/288?random=4",
    type: "image",
    gender: "male"
  },
  {
    id: "5",
    name: "Aria",
    category: "Fashion",
    description: "Fashion influencer avatar",
    tags: ["Fashion", "Style"],
    imageUrl: "https://picsum.photos/220/288?random=5",
    type: "image",
    gender: "female"
  },
  {
    id: "6",
    name: "Diego",
    category: "Fitness",
    description: "Fitness coach avatar",
    tags: ["Fitness", "Health"],
    imageUrl: "https://picsum.photos/220/288?random=6",
    type: "image",
    gender: "male"
  },
  {
    id: "7",
    name: "Maya",
    category: "Education",
    description: "Educational presenter avatar",
    tags: ["Education", "Teaching"],
    imageUrl: "https://picsum.photos/220/288?random=7",
    type: "image",
    gender: "female"
  },
  {
    id: "8",
    name: "Alex",
    category: "Business",
    description: "Executive presenter avatar",
    tags: ["Executive", "Leadership"],
    imageUrl: "https://picsum.photos/220/288?random=8",
    type: "image",
    gender: "male"
  },
  {
    id: "9",
    name: "Luna",
    category: "Wellness",
    description: "Wellness coach avatar",
    tags: ["Wellness", "Mindfulness"],
    imageUrl: "https://picsum.photos/220/288?random=9",
    type: "image",
    gender: "female"
  },
  {
    id: "10",
    name: "Oliver",
    category: "Finance",
    description: "Financial advisor avatar",
    tags: ["Finance", "Investment"],
    imageUrl: "https://picsum.photos/220/288?random=10",
    type: "image",
    gender: "male"
  },
  {
    id: "11",
    name: "Zara",
    category: "Travel",
    description: "Travel vlogger avatar",
    tags: ["Travel", "Adventure"],
    imageUrl: "https://picsum.photos/220/288?random=11",
    type: "image",
    gender: "female"
  },
  {
    id: "12",
    name: "Ethan",
    category: "Gaming",
    description: "Gaming streamer avatar",
    tags: ["Gaming", "Entertainment"],
    imageUrl: "https://picsum.photos/220/288?random=12",
    type: "image",
    gender: "male"
  },
  {
    id: "13",
    name: "Isabella",
    category: "Food",
    description: "Culinary expert avatar",
    tags: ["Culinary", "Cooking"],
    imageUrl: "https://picsum.photos/220/288?random=13",
    type: "image",
    gender: "female"
  },
  {
    id: "14",
    name: "Ryan",
    category: "Sports",
    description: "Sports commentator avatar",
    tags: ["Sports", "Commentary"],
    imageUrl: "https://picsum.photos/220/288?random=14",
    type: "image",
    gender: "male"
  },
  {
    id: "15",
    name: "Chloe",
    category: "Music",
    description: "Music presenter avatar",
    tags: ["Music", "Entertainment"],
    imageUrl: "https://picsum.photos/220/288?random=15",
    type: "image",
    gender: "female"
  },
  {
    id: "16",
    name: "Nathan",
    category: "Real Estate",
    description: "Property expert avatar",
    tags: ["Real Estate", "Investment"],
    imageUrl: "https://picsum.photos/220/288?random=16",
    type: "image",
    gender: "male"
  },
  {
    id: "17",
    name: "Lily",
    category: "Beauty",
    description: "Beauty consultant avatar",
    tags: ["Beauty", "Skincare"],
    imageUrl: "https://picsum.photos/220/288?random=17",
    type: "image",
    gender: "female"
  },
  {
    id: "18",
    name: "Jordan",
    category: "Automotive",
    description: "Car reviewer avatar",
    tags: ["Automotive", "Reviews"],
    imageUrl: "https://picsum.photos/220/288?random=18",
    type: "image",
    gender: "male"
  },
  {
    id: "19",
    name: "Grace",
    category: "Lifestyle",
    description: "Lifestyle influencer avatar",
    tags: ["Lifestyle", "Inspiration"],
    imageUrl: "https://picsum.photos/220/288?random=19",
    type: "image",
    gender: "female"
  },
  {
    id: "20",
    name: "Tyler",
    category: "Photography",
    description: "Photography tutor avatar",
    tags: ["Photography", "Tutorial"],
    imageUrl: "https://picsum.photos/220/288?random=20",
    type: "image",
    gender: "male"
  }
]

const mockUGCVideos: UGCVideo[] = [
  {
    id: "1",
    title: "Product Demo",
    creator: "John Doe",
    thumbnail: "https://picsum.photos/300/200?random=50",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "2",
    title: "Brand Story",
    creator: "Jane Smith",
    thumbnail: "https://picsum.photos/300/200?random=51",
    videoUrl: "#", 
    category: "Avatar"
  },
  {
    id: "3",
    title: "Tech Review",
    creator: "Mike Johnson",
    thumbnail: "https://picsum.photos/300/200?random=52",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "4",
    title: "Fashion Haul",
    creator: "Sarah Wilson",
    thumbnail: "https://picsum.photos/300/200?random=53",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "5",
    title: "Fitness Journey",
    creator: "Alex Garcia",
    thumbnail: "https://picsum.photos/300/200?random=54",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "6",
    title: "Cooking Tutorial",
    creator: "Emma Chen",
    thumbnail: "https://picsum.photos/300/200?random=55",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "7",
    title: "Travel Vlog",
    creator: "David Martinez",
    thumbnail: "https://picsum.photos/300/200?random=56",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "8",
    title: "Business Pitch",
    creator: "Lisa Anderson",
    thumbnail: "https://picsum.photos/300/200?random=57",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "9",
    title: "Music Review",
    creator: "Ryan Taylor",
    thumbnail: "https://picsum.photos/300/200?random=58",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "10",
    title: "Gaming Setup",
    creator: "Jessica Lee",
    thumbnail: "https://picsum.photos/300/200?random=59",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "11",
    title: "Skincare Routine",
    creator: "Maya Patel",
    thumbnail: "https://picsum.photos/300/200?random=60",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "12",
    title: "Car Review",
    creator: "Tom Brown",
    thumbnail: "https://picsum.photos/300/200?random=61",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "13",
    title: "Home Decor",
    creator: "Nina Rodriguez",
    thumbnail: "https://picsum.photos/300/200?random=62",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "14",
    title: "Investment Tips",
    creator: "Kevin Zhang",
    thumbnail: "https://picsum.photos/300/200?random=63",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "15",
    title: "Art Tutorial",
    creator: "Sophie Miller",
    thumbnail: "https://picsum.photos/300/200?random=64",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "16",
    title: "Photography Tips",
    creator: "Jake Williams",
    thumbnail: "https://picsum.photos/300/200?random=65",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "17",
    title: "Language Learning",
    creator: "Anna Kowalski",
    thumbnail: "https://picsum.photos/300/200?random=66",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "18",
    title: "Startup Story",
    creator: "Chris Park",
    thumbnail: "https://picsum.photos/300/200?random=67",
    videoUrl: "#",
    category: "Product"
  },
  {
    id: "19",
    title: "Wellness Guide",
    creator: "Lauren Davis",
    thumbnail: "https://picsum.photos/300/200?random=68",
    videoUrl: "#",
    category: "Avatar"
  },
  {
    id: "20",
    title: "DIY Projects",
    creator: "Mark Thompson",
    thumbnail: "https://picsum.photos/300/200?random=69",
    videoUrl: "#",
    category: "Product"
  }
]

export default function Page() {
  return <DashboardMain 
    avatars={mockAvatars} 
    ugcVideos={mockUGCVideos}
    featuredImages={{
      talkingAvatars: "https://picsum.photos/400/300?random=100",
      scenesAndBrolls: "https://picsum.photos/400/300?random=101"
    }}
  />
}
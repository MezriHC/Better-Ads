export interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image" | "video"
}

export const mockAvatars: Avatar[] = [
  {
    id: "avatar-1",
    name: "Alex Morgan",
    category: "Business",
    description: "Professional business presenter with formal attire",
    tags: ["Professional", "Business", "Formal"],
    imageUrl: "https://picsum.photos/300/400?random=1",
    type: "image"
  },
  {
    id: "avatar-2",
    name: "Emma Chen",
    category: "Tech",
    description: "Tech enthusiast perfect for product demos",
    tags: ["Tech", "Young", "Energetic"],
    imageUrl: "https://picsum.photos/300/400?random=2",
    type: "image"
  },
  {
    id: "avatar-3",
    name: "Marcus Williams",
    category: "Creative",
    description: "Creative professional for artistic presentations",
    tags: ["Creative", "Artistic", "Casual"],
    imageUrl: "https://picsum.photos/300/400?random=3",
    type: "image"
  },
  {
    id: "avatar-4",
    name: "Sarah Johnson",
    category: "Healthcare",
    description: "Medical professional for health-related content",
    tags: ["Medical", "Professional", "Trustworthy"],
    imageUrl: "https://picsum.photos/300/400?random=4",
    type: "image"
  },
  {
    id: "avatar-5",
    name: "David Rodriguez",
    category: "Education",
    description: "Educator perfect for tutorials and training",
    tags: ["Education", "Teacher", "Friendly"],
    imageUrl: "https://picsum.photos/300/400?random=5",
    type: "image"
  },
  {
    id: "avatar-6",
    name: "Lisa Park",
    category: "Fashion",
    description: "Fashion-forward presenter for lifestyle content",
    tags: ["Fashion", "Lifestyle", "Trendy"],
    imageUrl: "https://picsum.photos/300/400?random=6",
    type: "image"
  }
]
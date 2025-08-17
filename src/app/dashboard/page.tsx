import { FeatureCard } from "./components/FeatureCard";
import { AvatarSlider } from "./components/AvatarSlider";
import { UGCShowcase } from "./components/UGCShowcase";
import { SectionHeader } from "./components/SectionHeader";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      
      <section className="flex flex-col gap-4">
        <SectionHeader 
          title="Create a new video"
          description="Select a feature to get started. Create a video from a product page or from a script."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCard 
            title="Talking Avatars"
            description="Create videos with AI avatars presenting your products or messages with natural speech."
            href="/dashboard/create"
            imageUrl="https://picsum.photos/400/300?random=1"
          />
          <FeatureCard 
            title="Scenes & B-Rolls"
            description="Generate cinematic scenes and professional b-roll footage for your video projects."
            href="/dashboard/create"
            imageUrl="https://picsum.photos/400/300?random=2"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader 
          title="Discover our AI Avatars"
          description="Browse our collection of AI avatars and find the perfect one for your next video."
        />
        <AvatarSlider />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader 
          title="Trending UGC created with our tool"
          description="Discover inspiring videos created by our community using our AI avatars and tools."
        />
        <UGCShowcase />
      </section>
      
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  onClick?: () => void;
}

export function FeatureCard({ title, description, href, imageUrl, onClick }: FeatureCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl flex flex-col md:flex-row overflow-hidden relative">
      <div className="p-8 flex flex-col flex-1 z-10 gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-card-foreground">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="self-start cursor-pointer" onClick={onClick}>
          <div className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20">
            <div className="group rounded-[14px] bg-foreground shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] w-full cursor-pointer">
              <div className="px-6 py-3 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px]">
                <span className="font-semibold text-background">
                  Create now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-1/3 relative">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/70 to-transparent md:from-card/20 md:via-transparent md:to-transparent"></div>
      </div>
    </div>
  );
}
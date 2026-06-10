import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { PlantsSection } from '@/components/PlantsSection';
import { FeaturedRosesPreview } from '@/components/FeaturedRosesPreview';
import { CategoryMosaic } from '@/components/CategoryMosaic';
import { AboutSection } from '@/components/AboutSection';
import { YouTubeSection } from '@/components/YouTubeSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <HeroSection />
      <CategoryMosaic />
      <AboutSection />
      <PlantsSection />
      <FeaturedRosesPreview />
      <YouTubeSection />
      <Footer />
    </div>
  );
}

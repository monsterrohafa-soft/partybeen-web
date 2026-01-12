import HeroSection from '@/components/home/HeroSection';
import ServiceCategories from '@/components/home/ServiceCategories';
import RecentPortfolio from '@/components/home/RecentPortfolio';
import ContactCTA from '@/components/home/ContactCTA';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServiceCategories />
      <RecentPortfolio />
      <ContactCTA />
    </>
  );
}

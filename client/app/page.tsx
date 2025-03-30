import { AccordionComponent } from "@/components/homepage/accordion-component";
import HeroSection from "@/components/homepage/hero-section";
import MarketingCards from "@/components/homepage/marketing-cards";
import SideBySide from "@/components/homepage/side-by-side";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default function Home() {

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center w-full">
        <HeroSection />
      </div>
      <SideBySide />
      <MarketingCards />
    
      <AccordionComponent />
    </PageWrapper>
  );
}

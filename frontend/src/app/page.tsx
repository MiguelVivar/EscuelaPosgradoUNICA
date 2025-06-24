import ScrollAnimationProvider from "@/providers/ScrollAnimationProvider";
import Carousel from "@/components/ui/home/Carrousel";
import Welcome from "@/components/ui/home/Welcome";
import MissionVision from "@/components/ui/home/MissionVision";
import AcademicObjectives from "@/components/ui/home/AcademicObjectives";

export default function Home() {
  return (
    <ScrollAnimationProvider>
      <main className="bg-gray-50 overflow-x-hidden">
        <Carousel />
        <Welcome />
        <MissionVision />
        <AcademicObjectives />
      </main>
    </ScrollAnimationProvider>
  );
}

import Carousel from "@/components/ui/home/Carrousel";
import Welcome from "@/components/ui/home/Welcome";

export default function Home() {
  return (
    <main className="bg-gray-50">
      <Carousel />
      <Welcome />
    </main>
  );
}

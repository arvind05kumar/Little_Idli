import LittleIdliScroll from "@/components/LittleIdliScroll";
import Navbar from "@/components/Navbar";
import MenuSection from "@/components/MenuSection";
import ReviewSection from "@/components/ReviewSection";

export default function Home() {
  return (
    <main className="w-full bg-[#F6F1E9] min-h-screen">
      <Navbar />
      <LittleIdliScroll />
      <MenuSection />
      <ReviewSection />
    </main>
  );
}

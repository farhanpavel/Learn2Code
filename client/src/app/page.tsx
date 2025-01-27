import Header from "@/components/Header/page";
import Image from "next/image";
import Hero from "./_home/Hero";

export default function Home() {
  return (
    <div>
      <div className="bg-[#f5f7f9]">
        <Header />
        <Hero />
      </div>
    </div>
  );
}

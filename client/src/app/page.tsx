import Header from "@/components/Header/page";
import Image from "next/image";
import Hero from "./_home/Hero";
import Benefits from "./_home/Benefits";
import Feature from "./_home/Feature";
import Contact from "./_home/Contact";
import Footer from "@/components/Footer/page";

export default function Home() {
  return (
    <div>
      <div className="bg-[#f5f7f9] ">
        <Header />
        <Hero />
      </div>
      <div className="bg-[#10343c] p-4">
        <Benefits />
      </div>
      <div className="p-1 mt-5">
        <Feature />
      </div>
      <div className="bg-black p-3 mt-5">
        <Contact />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

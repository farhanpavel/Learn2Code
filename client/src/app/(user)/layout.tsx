import Sidebar from "@/components/Sidebar/page";
import { Toaster } from "@/components/ui/toaster";

export default function Landing({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <Sidebar />
      <div className="w-[90%]">{children}</div>
      <Toaster />
    </div>
  );
}

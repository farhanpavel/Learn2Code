"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Upload,
  BookOpen,
  RefreshCw,
  Lightbulb,
  Mic,
  LogOut,
} from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  label?: string;
  disabled?: boolean;
};

const defaultNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/userdashboard/overview",
    icon: <Home size={20} />,
  },
  {
    title: "Uploads",
    href: "/userdashboard/upload",
    icon: <Upload size={20} />,
  },
  {
    title: "Study", // This will be updated dynamically
    href: "/userdashboard/study",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Planner",
    href: "/userdashboard/planner",
    icon: <RefreshCw size={20} />,
  },
  {
    title: "Quiz",
    href: "/userdashboard/quiz",
    icon: <Lightbulb size={20} />,
  },
  {
    title: "Interview",
    href: "/userdashboard/interview",
    icon: <Mic size={20} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [tripPlanId, setTripPlanId] = useState("");
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);

  useEffect(() => {
    // Get the 'videodata' cookie
    const videoData = Cookies.get("videodata");

    // Update the "Study" link dynamically if videoData exists
    if (videoData) {
      setNavItems((prevItems) =>
        prevItems.map((item) =>
          item.title === "Study"
            ? {
                ...item,
                href: `/userdashboard/study/watch${
                  videoData.startsWith("?") ? videoData : `?${videoData}`
                }`,
              }
            : item
        )
      );
    }

    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    setTripPlanId(queryParams.get("tripPlanId") || "");
  }, []);

  const handleLogout = () => {
    Cookies.remove("AccessToken");
    Cookies.remove("RefreshToken");
    Cookies.remove("title");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 left-0 h-screen w-64 border-r bg-background pt-16 flex flex-col">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-center border-b px-2">
            <Image
              src="/images/logo2.png"
              alt="Dashboard Logo"
              width={150}
              height={150}
              className="text-lg font-semibold tracking-tight"
            />
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="flex flex-col gap-y-1 py-4">
              {navItems.map((item, index) => {
                const href = item.disabled
                  ? "/"
                  : `${item.href}${
                      tripPlanId ? `&tripPlanId=${tripPlanId}` : ""
                    }`;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link key={index} href={href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        item.disabled && "pointer-events-none opacity-60"
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
          <div className="mt-auto border-t p-2">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { IoBulbOutline } from "react-icons/io5";
import { AiOutlineRetweet } from "react-icons/ai";
import { RiSpeakAiFill } from "react-icons/ri";
import { MdOutlineUploadFile } from "react-icons/md";
import Image from "next/image";
import { LuLogOut } from "react-icons/lu";

type NavItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  label?: string;
  disabled?: boolean;
};

const navItems: NavItem[] = [
  { title: "Overview", href: "/userdashboard/overview", icon: <FaHome /> },
  {
    title: "Uploads",
    href: "/userdashboard/upload",
    icon: <MdOutlineUploadFile />,
  },
  { title: "Study", href: "/userdashboard/study", icon: <FaBookOpen /> },
  {
    title: "Planner",
    href: "/userdashboard/planner",
    icon: <AiOutlineRetweet />,
  },
  { title: "Quiz", href: "/userdashboard/quiz", icon: <IoBulbOutline /> },
  {
    title: "Interview",
    href: "/userdashboard/interview",
    icon: <RiSpeakAiFill />,
  },
];

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const path = usePathname();
  const searchParams = useSearchParams();
  const tripPlanId = searchParams.get("tripPlanId");

  return (
    <div className="flex min-h-screen">
      <nav
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`sticky top-0 left-0  h-screen  bg-gradient-to-b from-gray-200 via-green-200 to-[#38646e] pt-4 transition-all duration-300  text-black ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full justify-between py-4">
          <div className="overflow-y-auto">
            <div className="mb-5 flex justify-center items-center">
              <Image
                src={"/images/logo2.png"}
                width={100}
                height={100}
                alt="logo"
              />
            </div>

            <nav className="grid items-start gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={
                    item.disabled
                      ? "/"
                      : `${item.href}${
                          tripPlanId ? `?tripPlanId=${tripPlanId}` : ""
                        }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group relative overflow-hidden flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    path === item.href
                      ? "bg-green-300 text-black"
                      : "hover:bg-green-100 hover:text-black"
                  } ${item.disabled && "pointer-events-none opacity-60"}`}
                >
                  <div
                    className={`h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 ${
                      isSidebarOpen ? "mr-2" : ""
                    }`}
                  >
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="text-base font-semibold"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout Button at the End */}
          <div className="mt-auto">
            <Link
              href="/logout"
              className="group relative flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors "
            >
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 ${
                  isSidebarOpen ? "mr-2" : ""
                }`}
              >
                <LuLogOut />
              </div>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-base font-semibold"
                >
                  Logout
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

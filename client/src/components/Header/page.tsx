"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Header() {
  const [token, setToken] = useState<string | null>(null); // Allow string or null

  useEffect(() => {
    const storedToken = Cookies.get("AccessToken") || null; // Ensure null fallback
    setToken(storedToken);
  }, []);

  return (
    <header className="container mx-auto flex h-20 w-full shrink-0 justify-between items-center px-4 md:px-6 font-rubik">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden ">
            <MenuIcon className="h-6 w-6 " />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white">
          <Link href="#" prefetch={false}>
            <Image
              src="/images/logo2.png"
              width={260}
              height={200}
              alt="logo"
              className="2xl:w-[400px]"
            />
            <span className="sr-only">Company Logo</span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link
              href="#benefit"
              className="flex w-full items-center py-2 text-lg font-semibold "
              prefetch={false}
            >
              Benefits
            </Link>
            <Link
              href="#feature"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Features
            </Link>
            <Link
              href="#contact"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              How it Works
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div>
        <Link href="#" className="mr-6 hidden lg:flex  mt-1" prefetch={false}>
          <Image src="/images/logo2.png" width={150} height={100} alt="logo" />
          <span className="sr-only">Company Logo</span>
        </Link>
      </div>
      <div>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-14  2xl:space-x-24 mt-2 flex justify-center items-center">
            <NavigationMenuLink asChild>
              <Link
                href="#benefit"
                className="group inline-flex h-9 w-max items-center justify-center   
             px-4 py-2 text-lg 2xl:text-2xl font-semibold transition-all 
             text-black hover:shadow-[0_4px_2px_-2px_rgba(16,52,60,0.6)]

             duration-300"
                prefetch={false}
              >
                Benefits
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="#feature"
                className="group inline-flex h-9 w-max items-center justify-center   
             px-4 py-2 text-lg 2xl:text-2xl font-semibold transition-all 
             text-black hover:shadow-[0_4px_2px_-2px_rgba(16,52,60,0.6)]

             duration-300"
                prefetch={false}
              >
                Feature
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="#contact"
                className="group inline-flex h-9 w-max items-center justify-center   
             px-4 py-2 text-lg 2xl:text-2xl font-semibold transition-all 
             text-black hover:shadow-[0_4px_2px_-2px_rgba(16,52,60,0.6)]

             duration-300"
                prefetch={false}
              >
                Contact
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        {token ? (
          <Link
            href="/userdashboard/overview"
            className="bg-[#10343c] px-6 py-3 text-white rounded-full font-semibold 2xl:px-8 2xl:py-4"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/signin"
            className="bg-[#10343c] px-6 py-3 text-white rounded-full font-semibold 2xl:px-8 2xl:py-4"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

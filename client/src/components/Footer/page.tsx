import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-[#F7F7F3] py-10">
      <div className="container mx-auto">
        <div>
          <Image
            src="/images/logo2.png"
            width={200}
            height={100}
            alt="Logo"
            className="mx-auto"
          />
        </div>

        <div className="mt-6 sm:flex sm:flex-wrap sm:justify-center sm:flex-row">
          <ul className="sm:flex text-center gap-x-6 text-[#4A4A4A] font-rubik text-sm md:text-base">
            <li className="hover:text-green-900 cursor-pointer hover:transition-colors hover:delay-150">
              Contact
            </li>
            <li className="hover:text-green-900 cursor-pointer hover:transition-colors hover:delay-150">
              FAQ
            </li>
            <li className="hover:text-green-900cursor-pointer hover:transition-colors hover:delay-150">
              Support
            </li>
            <li className="hover:text-green-900 cursor-pointer hover:transition-colors hover:delay-150">
              Terms & Conditions
            </li>
            <li className="hover:text-green-900 cursor-pointer hover:transition-colors hover:delay-150">
              Privacy Policy
            </li>
          </ul>
        </div>

        <div className="p-7 mt-5">
          <div className="border-t-[0.5px] p-4 border-[#E0DEDE]">
            <div className="sm:flex sm:flex-wrap sm:justify-between font-rubik text-[#4A4A4A] text-sm">
              <div className="text-center mb-4 sm:mb-0">
                <p>Copyright © 2025 | Learn2Code, All rights reserved.</p>
              </div>

              <div>
                <ul className="sm:flex sm:flex-wrap text-center gap-x-7">
                  <li className="hover:text-green-900 cursor-pointer hover:transition-colors hover:delay-150">
                    Contact
                  </li>
                  <li className="hover:text-green-900 cursor-pointer hover:transition-colors hover:delay-150">
                    Terms & Conditions
                  </li>
                  <li className="hover:text-green-900 cursor-pointer hover:transition-colors hover:delay-150">
                    Cookies
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

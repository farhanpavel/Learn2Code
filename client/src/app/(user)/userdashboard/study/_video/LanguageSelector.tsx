"use client";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  csharp: "6.12.0",
  php: "8.2.3",
  java: "15.0.2",
  typescript: "5.0.3",
  javascript: "18.15.0"
};

const languages = Object.entries(LANGUAGE_VERSIONS);

interface LanguageSelectorProps {
  language: keyof typeof LANGUAGE_VERSIONS;
  onSelect: (language: keyof typeof LANGUAGE_VERSIONS) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  return (
    <div className="ml-2 mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-row gap-1 items-center">
            <Button className="bg-green-800 text-white w-32">
              {language.charAt(0).toUpperCase()}{language.substring(1)}
            </Button>
            {/* Dropdown button */}
            <Button color='gray' className='bg-gray-200 border border-gray-800 hover:bg-green-800'>
              <FaChevronDown color='black' />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Choose Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={language} onValueChange={(value) => onSelect(value as keyof typeof LANGUAGE_VERSIONS)}>
            {languages.map(([lang, version]) => (
              <DropdownMenuRadioItem key={lang} value={lang} className={lang === language ? "bg-blue-100 text-green-600" : "text-gray-900"}>
                {lang} <span className="text-gray-500 text-sm">({version})</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
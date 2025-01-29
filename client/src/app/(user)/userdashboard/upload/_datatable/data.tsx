import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

export type Flight = {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  _id: string;
};

export const ActionsCell: React.FC<{ user: Flight }> = ({ user }) => {
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="  p-1 hover:bg-purple-200 outline-none rounded-full hover:transition-all hover:delay-100">
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs text-[#4a4a4a]">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push("/flightdashboard/entry/schedule/details");
            }}
            className="hover:bg-purple-200 rounded-lg hover:transition-all hover:delay-100 text-xs text-[#4a4a4a]"
          >
            Take Quiz
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

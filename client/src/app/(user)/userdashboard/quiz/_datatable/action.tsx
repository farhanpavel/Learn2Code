import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowUpDown } from "lucide-react";
import { FaFile } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./data";
import { url } from "@/components/Url/page";
import LoadingSpinner from "@/components/Loader/page";
import ScaleLoader from "react-spinners/ScaleLoader";
export type Book = {
  pdfUrl: string;
  Booktype: string;
  Booktopic: string;
  date: string;
  _id: string;
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "Booktopic",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];

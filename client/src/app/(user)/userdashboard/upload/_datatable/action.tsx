import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ArrowUpDown } from "lucide-react";
import { FaFile } from "react-icons/fa";
import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./data";

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
        className="hover:bg-green-200 flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const router = useRouter();

      const handleClick = () => {
        // Set a cookie when the name is clicked
        Cookies.set("Id", row.original._id);

        // Redirect to the desired page
        router.push("upload/read");
      };

      return (
        <div className="flex items-center">
          <FaFile className="text-gray-500 mr-2" />
          <p className="mt-[0.6px] cursor-pointer" onClick={handleClick}>
            {row.getValue("name")}
          </p>
        </div>
      );
    },
    enableSorting: true,
  },

  {
    accessorKey: "Booktype",
    header: ({ column }) => (
      <button
        className="hover:bg-green-200  flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),

    enableSorting: true,
  },
  {
    accessorKey: "Booktopic",
    header: ({ column }) => (
      <button
        className="hover:bg-green-200  flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Topic
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <button
        className="hover:bg-green-200  flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Create Date
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

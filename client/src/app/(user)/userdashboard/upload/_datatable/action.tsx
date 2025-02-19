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
  status: string;
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      const [loading, setLoading] = useState(false); // Add loading state

      const handleClick = async () => {
        setLoading(true); // Start loading
        Cookies.set("Id", row.original._id);

        try {
          const requestData = {
            pdfUrl: row.original.pdfUrl,
          };

          const response = await fetch(`${url}/api/extract-pdf-text`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (response.ok) {
            const data = await response.json();

            router.push("upload/read");
          } else {
            console.error("Failed to extract PDF text");
          }
        } catch (error) {
          console.error("Error sending request:", error);
        } finally {
          setLoading(false); // Stop loading after navigation (if needed)
        }
      };

      return (
        <div className="flex items-center">
          <FaFile className="text-gray-500 mr-2" />
          <p className="mt-[0.6px] cursor-pointer" onClick={handleClick}>
            {row.getValue("name")}
          </p>

          {/* Loader */}
          {loading && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <ScaleLoader color="black" />
            </div>
          )}
        </div>
      );
    },
    enableSorting: true,
  },

  {
    accessorKey: "Booktype",
    header: ({ column }) => (
      <button
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
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
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
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
        className="hover:bg-black hover:text-white flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
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

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ArrowUpDown } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./data";

export type Flight = {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  _id: string;
};

export const columns: ColumnDef<Flight>[] = [
  {
    accessorKey: "flightNumber",

    header: ({ column }) => (
      <button
        className="hover:bg-green-200 flex items-center px-4 py-2 rounded-full hover:transition-all hover:delay-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "airline",
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
    accessorKey: "origin",
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
    accessorKey: "destination",
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

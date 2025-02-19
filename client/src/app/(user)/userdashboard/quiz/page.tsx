"use client";
import React, { useEffect, useState } from "react";
import { url } from "@/components/Url/page";
import { MdViewComfy } from "react-icons/md";
import {
  ColumnDef,
  SortingState,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, columns } from "./_datatable/action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ImUpload } from "react-icons/im";
import { PiUploadSimpleBold } from "react-icons/pi";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/components/tableContext/page";
import { FaLightbulb } from "react-icons/fa";

export default function Page() {
  const { bookData, setbookData } = useAppContext();

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${url}/api/question/data`);
      const json = await response.json();
      if (response.ok) {
        setbookData(json);
      }
    };
    fetchData();
  }, []);

  const table = useReactTable({
    data: bookData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="p-9 space-y-2 ">
        <div className="flex gap-x-2 items-center ">
          <FaLightbulb className="text-3xl" />
          <h1 className="text-2xl font-bold">Quiz List</h1>
        </div>
        <p className="text-xs text-[#4a4a4a]  border-black  border-b-[2px] pb-4">
          Manage all of your Quizes here!
        </p>
        <div className="flex justify-end">
          <div>
            <div className="flex space-x-4 items-center mt-2">
              <Input
                placeholder="Search by Title"
                className="w-[250px] border-black focus:ring-black  text-xs"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-black text-black hover:bg-[#121f21] hover:text-white"
                  >
                    <MdViewComfy className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Grid View</DropdownMenuItem>
                  <DropdownMenuItem>List View</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="space-y-4  p-3">
          <div className="rounded-md border">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="text-left ">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[310px] text-center text-muted-foreground border-[1px] border-gray-300"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
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
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Flight, columns } from "./_datatable/action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MdOutlineUploadFile } from "react-icons/md";
import { PiUploadSimpleBold } from "react-icons/pi";
export default function Page() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [users, setUsers] = useState<Flight[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch(``);
  //     const json = await response.json();
  //     console.log(json.data.data);
  //     if (response.ok) {
  //       setUsers(json.data.data);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const table = useReactTable({
    data: [],
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
        <div className="flex gap-x-2 items-center text-green-600">
          <MdOutlineUploadFile className="text-3xl" />
          <h1 className="text-2xl font-bold">Uploads</h1>
        </div>
        <p className="text-xs text-[#4a4a4a]  border-[#d1cece] border-b-[2px] pb-4">
          Manage all of your uploads here!
        </p>
        <div className="flex justify-between">
          <div>
            <button
              type="submit"
              className="px-6 py-2 bg-green-800  text-white rounded-lg mt-2"
            >
              <div className="flex items-center gap-x-1">
                <PiUploadSimpleBold className="text-white text-sm" />
                <p className="text-semibold text-sm font-bold"> Upload</p>
              </div>
            </button>
          </div>
          <div className="flex space-x-4 items-center mt-2">
            <Input
              placeholder="Search by name"
              value={(table.getColumn("")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("")?.setFilterValue(event.target.value)
              }
              className="max-w-sm h-[71%] text-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto  h-[71%] flex items-center gap-x-2 bg-[#F2F4F4] border-[1px] border-green-700"
                >
                  <MdViewComfy className="flex items-center" /> View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  // .map((column) => {
                  //   return (
                  //     <DropdownMenuCheckboxItem
                  //       key={column.id}
                  //       className="capitalize"
                  //       checked={column.getIsVisible()}
                  //       onCheckedChange={(value) =>
                  //         column.toggleVisibility(!!value)
                  //       }
                  //     >
                  //       {column.id}
                  //     </DropdownMenuCheckboxItem>
                  //   );
                  })} */}
              </DropdownMenuContent>
            </DropdownMenu>
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

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
import { MdOutlineUploadFile } from "react-icons/md";
import { PiUploadSimpleBold } from "react-icons/pi";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/components/tableContext/page";

export default function Page() {
  const { bookData, setbookData } = useAppContext();
  const [isLoading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [book, setBook] = useState({
    Booktype: "PDF",
    Booktopic: "",
  });
  const [dataAll, setData] = useState<Book[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
      formData.append("Booktype", book.Booktype);
      formData.append("Booktopic", book.Booktopic);

      const response = await fetch(`${url}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Server Error");
        throw new Error("Failed to upload file");
      } else {
        setLoading(false);
        const uploadedBookData = await response.json();
        console.log(uploadedBookData);
        setbookData([...bookData, uploadedBookData.data]);
        alert("Upload successful!");
        setIsDialogOpen(false); // <-- Close the dialog on successful upload
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${url}/api/pdfs`);
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
        <div className="flex gap-x-2 items-center text-green-600">
          <MdOutlineUploadFile className="text-3xl" />
          <h1 className="text-2xl font-bold">Uploads</h1>
        </div>
        <p className="text-xs text-[#4a4a4a]  border-[#d1cece] border-b-[2px] pb-4">
          Manage all of your uploads here!
        </p>
        <div className="flex justify-between">
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="px-6 py-2 bg-green-800 text-white rounded-lg mt-2 flex items-center gap-x-1">
                  <PiUploadSimpleBold className="text-white text-sm" />
                  <p className="text-semibold text-sm font-bold"> Upload</p>
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Select a file to upload. Click "Upload" when ready.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="topic" className="text-right">
                      Topic
                    </Label>
                    <Input
                      id="topic"
                      name="Booktopic"
                      type="text"
                      className="col-span-3"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right">
                      File
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept="application/pdf"
                      className="col-span-3"
                      name="pdfFile"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <DialogFooter>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-800 text-white rounded-lg mt-2 flex items-center gap-x-1"
                      disabled={isLoading}
                    >
                      <p className="text-semibold text-sm font-bold">
                        {" "}
                        {isLoading ? (
                          <div className="flex items-center">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Uploading...
                          </div>
                        ) : (
                          "Upload"
                        )}
                      </p>
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <div className="flex space-x-4 items-center mt-2">
              <Input
                placeholder="Search by name"
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

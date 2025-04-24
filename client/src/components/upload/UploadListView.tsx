"use client";
import React from "react";
import { Book } from "./UploadCard";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaFilePdf, FaBook, FaEllipsisH } from "react-icons/fa";
import { url } from "@/components/Url/page";
import {
  DropdownMenu,
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { cn } from "@/lib/utils";

interface UploadListViewProps {
  books: Book[];
  onDelete: (id: string) => void;
  searchQuery: string;
}

export default function UploadListView({
  books,
  onDelete,
  searchQuery,
}: UploadListViewProps) {
  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.Booktopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 rounded-lg">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-medium text-gray-700 mb-1">
          No documents found
        </h3>
        <p className="text-sm text-gray-500">
          {searchQuery
            ? "Try a different search term"
            : "Upload your first document to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200">
        <div className="col-span-5 font-medium text-sm text-gray-600">
          Document Name
        </div>
        <div className="col-span-2 font-medium text-sm text-gray-600">Type</div>
        <div className="col-span-3 font-medium text-sm text-gray-600">
          Topic
        </div>
        <div className="col-span-2 font-medium text-sm text-gray-600 text-right">
          Created
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {filteredBooks.map((book) => (
          <ListRow key={book._id} book={book} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

function ListRow({
  book,
  onDelete,
}: {
  book: Book;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Format the date
  const formattedDate = (() => {
    try {
      return format(new Date(book.date), "MMM d, yyyy");
    } catch (e) {
      return book.date || "Unknown date";
    }
  })();

  const handleRowClick = async () => {
    setLoading(true);
    Cookies.set("Id", book._id);

    try {
      const response = await fetch(`${url}/api/extract-pdf-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl: book.pdfUrl }),
      });

      if (response.ok) {
        router.push("upload/read");
      } else {
        console.error("Failed to extract PDF text");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuiz = async (e: React.MouseEvent) => {
    e.stopPropagation();
    Cookies.set("title", book.Booktopic);
    const accessToken = Cookies.get("AccessToken");

    if (!accessToken) {
      alert("You are not authenticated!");
      return;
    }

    setLoading(true);
    try {
      const response1 = await fetch(`${url}/api/result/all/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl: book.pdfUrl }),
      });

      const response2 = await fetch(`${url}/api/data/question-generate`, {
        method: "POST",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl: book.pdfUrl,
          title: book.Booktopic,
        }),
      });

      if (response2.ok && response1.ok) {
        router.push("/userdashboard/quiz/take");
      } else {
        console.error("Failed to extract PDF text");
      }
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${url}/api/pdfs/${book._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete document");
        throw new Error("Failed to delete document");
      } else {
        onDelete(book._id);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <>
      <div
        className="grid grid-cols-12 p-4 hover:bg-gray-50 cursor-pointer group"
        onClick={handleRowClick}
      >
        <div className="col-span-5 flex items-center gap-2">
          <div
            className={cn(
              "w-1 h-8 rounded-full mr-2",
              book.status === "0" ? "bg-green-500" : "bg-blue-500"
            )}
          />
          {book.Booktype === "PDF" ? (
            <FaFilePdf className="text-red-500 text-lg" />
          ) : (
            <FaBook className="text-blue-500 text-lg" />
          )}
          <span className="font-medium text-gray-800 group-hover:text-black transition-colors">
            {book.name}
          </span>
        </div>

        <div className="col-span-2 flex items-center">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {book.Booktype}
          </span>
        </div>

        <div className="col-span-3 flex items-center">
          <span className="text-sm text-gray-600">{book.Booktopic}</span>
        </div>

        <div className="col-span-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">{formattedDate}</span>

          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <FaEllipsisH className="h-3 w-3 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-gray-500">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {book.status === "0" && (
                  <DropdownMenuItem
                    onClick={handleQuiz}
                    className="text-xs cursor-pointer flex items-center gap-2 hover:bg-green-50 text-gray-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Take Quiz
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setIsDialogOpen(true)}
                  className="text-xs cursor-pointer flex items-center gap-2 hover:bg-red-50 text-gray-700"
                >
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{book.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <ScaleLoader color="black" />
        </div>
      )}
    </>
  );
}

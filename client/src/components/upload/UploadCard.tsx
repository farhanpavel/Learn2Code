"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaFile, FaBook, FaFilePdf } from "react-icons/fa";
import { MoreHorizontal } from "lucide-react";
import { url } from "@/components/Url/page";
import ScaleLoader from "react-spinners/ScaleLoader";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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

export type Book = {
  _id: string;
  pdfUrl: string;
  Booktype: string;
  Booktopic: string;
  date: string;
  name: string;
  status: string;
};

interface UploadCardProps {
  book: Book;
  onDelete: (id: string) => void;
}

export default function UploadCard({ book, onDelete }: UploadCardProps) {
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

  const handleCardClick = async () => {
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

  const handleQuiz = async () => {
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
      <div className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              {book.Booktype === "PDF" ? (
                <FaFilePdf className="text-red-500 text-lg" />
              ) : (
                <FaBook className="text-blue-500 text-lg" />
              )}
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {book.Booktype}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
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

          <div onClick={handleCardClick} className="cursor-pointer">
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-black transition-colors">
              {book.name}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Topic:</span>
                <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                  {book.Booktopic}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Created:</span>
                <span className="text-xs text-gray-600">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "h-1.5 w-full",
            book.status === "0" ? "bg-green-500" : "bg-blue-500"
          )}
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{book.name}&quot;? This action cannot
              be undone.
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

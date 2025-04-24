"use client";
import React, { useEffect, useState } from "react";
import { ImUpload } from "react-icons/im";
import { MdOutlineGridView, MdOutlineViewList } from "react-icons/md";
import { PiUploadSimpleBold } from "react-icons/pi";
import { FaFilePdf, FaBook, FaEllipsisH } from "react-icons/fa";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ScaleLoader from "react-spinners/ScaleLoader";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { url } from "@/components/Url/page";

// Types
export type Book = {
  _id: string;
  pdfUrl: string;
  Booktype: string;
  Booktopic: string;
  date: string;
  name: string;
  status: string;
};

// API URL

export default function Page() {
  const [bookData, setBookData] = useState<Book[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    Booktype: "PDF",
    Booktopic: "",
    status: "0",
  });
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  useEffect(() => {
    const accessToken = Cookies.get("AccessToken");
    fetchDocuments(accessToken);
  }, []);

  const fetchDocuments = async (accessToken: string | undefined) => {
    try {
      const response = await fetch(`${url}/api/pdfs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const json = await response.json();
      setBookData(json);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file) {
      alert("Please select a file before uploading.");
      setIsLoading(false);
      return;
    }

    const accessToken = Cookies.get("AccessToken");
    if (!accessToken) {
      alert("You are not authenticated!");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
      formData.append("Booktype", uploadForm.Booktype);
      formData.append("Booktopic", uploadForm.Booktopic);
      formData.append("status", uploadForm.status);

      const response = await fetch(`${url}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: accessToken,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const uploadedBookData = await response.json();
      setBookData((prev) => [...prev, uploadedBookData.data]);
      setIsUploadDialogOpen(false);
      resetUploadForm();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (book: Book) => {
    try {
      const response = await fetch(`${url}/api/pdfs/${book._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setBookData((prev) => prev.filter((item) => item._id !== book._id));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    }
  };

  const handleDocumentClick = async (book: Book) => {
    setIsLoading(true);
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
        throw new Error("Failed to extract PDF text");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to open document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuiz = async (book: Book) => {
    Cookies.set("title", book.Booktopic);
    const accessToken = Cookies.get("AccessToken");

    if (!accessToken) {
      alert("You are not authenticated!");
      return;
    }

    setIsLoading(true);
    try {
      const [response1, response2] = await Promise.all([
        fetch(`${url}/api/result/all/data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pdfUrl: book.pdfUrl }),
        }),
        fetch(`${url}/api/data/question-generate`, {
          method: "POST",
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pdfUrl: book.pdfUrl,
            title: book.Booktopic,
          }),
        }),
      ]);

      if (response1.ok && response2.ok) {
        router.push("/userdashboard/quiz/take");
      } else {
        throw new Error("Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to start quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      Booktype: "PDF",
      Booktopic: "",
      status: "0",
    });
    setFile(null);
  };

  const filteredBooks = bookData.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.Booktopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const DocumentCard = ({ book }: { book: Book }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const formattedDate = format(new Date(book.date), "MMM d, yyyy");

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
                      onClick={() => handleQuiz(book)}
                      className="text-xs cursor-pointer flex items-center gap-2 hover:bg-green-50 text-gray-700"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Take Quiz
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-xs cursor-pointer flex items-center gap-2 hover:bg-red-50 text-gray-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              onClick={() => handleDocumentClick(book)}
              className="cursor-pointer"
            >
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

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{book.name}&quot;? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  handleDelete(book);
                  setIsDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="bg-white p-4 rounded-full mb-6 shadow-sm">
        <PiUploadSimpleBold className="w-10 h-10 text-gray-400" />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No documents yet
      </h3>

      <p className="text-sm text-gray-500 text-center max-w-md mb-6">
        Upload your first document to start building your collection. You can
        upload PDFs and take quizzes based on their content.
      </p>

      <Button
        onClick={() => setIsUploadDialogOpen(true)}
        className="bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-x-2"
      >
        <PiUploadSimpleBold className="text-white text-sm" />
        <span>Upload Your First Document</span>
      </Button>
    </div>
  );

  return (
    <div className="p-6 md:p-9 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <ImUpload className="text-2xl text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        </div>
        <p className="text-sm text-gray-500 border-b border-gray-200 pb-4">
          Manage all your uploaded documents in one place
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-x-1">
              <PiUploadSimpleBold className="text-white text-sm" />
              <span className="font-medium">Upload Document</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a PDF document to your collection. Add a topic to help
                organize your documents.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpload} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="topic" className="text-right">
                  Topic
                </Label>
                <Input
                  id="topic"
                  name="Booktopic"
                  value={uploadForm.Booktopic}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      Booktopic: e.target.value,
                    }))
                  }
                  type="text"
                  className="col-span-3 border-gray-300 focus:ring-black focus:border-black"
                  required
                  placeholder="Enter document topic"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  File
                </Label>
                <div className="col-span-3">
                  <Input
                    id="file"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="border-gray-300 focus:ring-black focus:border-black"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only PDF files are supported
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadDialogOpen(false)}
                  className="mr-2"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-start sm:items-center">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[250px] border-gray-300 focus:ring-black focus:border-black text-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {viewMode === "grid" ? (
                  <MdOutlineGridView className="mr-2 h-4 w-4" />
                ) : (
                  <MdOutlineViewList className="mr-2 h-4 w-4" />
                )}
                {viewMode === "grid" ? "Grid View" : "List View"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode("grid")}>
                <MdOutlineGridView className="mr-2 h-4 w-4" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("list")}>
                <MdOutlineViewList className="mr-2 h-4 w-4" />
                List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {bookData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <DocumentCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <ScaleLoader color="white" />
        </div>
      )}
    </div>
  );
}

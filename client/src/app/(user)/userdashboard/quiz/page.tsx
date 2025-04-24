"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaLightbulb, FaBook, FaEllipsisH } from "react-icons/fa";
import { MdOutlineGridView, MdOutlineViewList } from "react-icons/md";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import ScaleLoader from "react-spinners/ScaleLoader";
import Cookies from "js-cookie";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
export type Quiz = {
  _id: string;
  pdfUrl: string;
  Booktype: string;
  Booktopic: string;
  date: string;
  name: string;
};

// API URL
export default function Page() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<Quiz[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("AccessToken");
    fetchQuizzes(accessToken);
  }, []);

  const fetchQuizzes = async (accessToken: string | undefined) => {
    try {
      const response = await fetch(`${url}/api/question/data`, {
        method: "GET",
        headers: {
          Authorization: accessToken || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const json = await response.json();
      setQuizData(json);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleDelete = async (quiz: Quiz) => {
    const accessToken = Cookies.get("AccessToken");
    try {
      const response = await fetch(
        `${url}/api/question/data/${quiz.Booktopic}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      setQuizData((prev) => prev.filter((item) => item._id !== quiz._id));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  const filteredQuizzes = quizData.filter(
    (quiz) =>
      quiz.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.Booktopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const QuizCard = ({ quiz }: { quiz: Quiz }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const formattedDate = format(new Date(quiz.date), "MMM d, yyyy");

    return (
      <>
        <div className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <FaBook className="text-blue-500 text-lg" />
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Quiz
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                    <FaEllipsisH className="h-3 w-3 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs text-gray-500">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(`/userdashboard/quiz/${quiz.Booktopic}`)
                    }
                    className="text-xs cursor-pointer flex items-center gap-2 hover:bg-green-50 text-gray-700"
                  >
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    View Quiz
                  </DropdownMenuItem>
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
              onClick={() =>
                router.push(`/userdashboard/quiz/${quiz.Booktopic}`)
              }
              className="cursor-pointer"
            >
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 group-hover:text-black transition-colors">
                {quiz.name || quiz.Booktopic}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Topic:</span>
                  <span className="text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                    {quiz.Booktopic}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Created:</span>
                  <span className="text-xs text-gray-600">{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-1.5 w-full bg-blue-500" />
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this quiz? This action cannot be
                undone.
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
                  handleDelete(quiz);
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
        <FaLightbulb className="w-10 h-10 text-yellow-400" />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No quizzes available
      </h3>

      <p className="text-sm text-gray-500 text-center max-w-md mb-6">
        Upload documents and generate quizzes to start testing your knowledge.
      </p>
    </div>
  );

  return (
    <div className="p-6 md:p-9 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <FaLightbulb className="text-2xl text-yellow-400" />
          <h1 className="text-2xl font-bold text-gray-900">Quiz List</h1>
        </div>
        <p className="text-sm text-gray-500 border-b border-gray-200 pb-4">
          Manage all your quizzes in one place
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-start sm:items-center">
          <Input
            placeholder="Search quizzes..."
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
        {quizData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
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

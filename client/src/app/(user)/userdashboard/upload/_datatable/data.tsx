import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/components/tableContext/page";
import { MoreHorizontal } from "lucide-react";
import { url } from "@/components/Url/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/Loader/page";
import ScaleLoader from "react-spinners/ScaleLoader";
import Cookies from "js-cookie";
export type Book = {
  _id: string;
  pdfUrl: string;
  Booktype: string;
  Booktopic: string;
  date: string;
  status: string;
};

export const ActionsCell: React.FC<{ user: Book }> = ({ user }) => {
  const { setbookData, bookData } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleQuiz = async () => {
    console.log(user.pdfUrl);
    Cookies.set("title", user.Booktopic);
    const accessToken = Cookies.get("AccessToken");
    console.log(accessToken);
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
        body: JSON.stringify({ pdfUrl: user.pdfUrl }),
      });
      const response2 = await fetch(`${url}/api/data/question-generate`, {
        method: "POST",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl: user.pdfUrl,
          title: user.Booktopic,
        }),
      });

      if (response2.ok && response1.ok) {
        const data = await response2.json();
        console.log(data);
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
      const response = await fetch(`${url}/api/pdfs/${user._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete user");
        throw new Error("Failed to delete user");
      } else {
        setbookData((prevData) =>
          prevData.filter((item) => item._id !== user._id)
        );
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-black hover:text-white outline-none rounded-full hover:transition-all hover:delay-100">
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs text-[#4a4a4a]">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.status == "0" && (
            <DropdownMenuItem
              onClick={() => handleQuiz()}
              className="hover:bg-green-200 hover:text-white rounded-lg hover:transition-all hover:delay-100 text-xs text-[#4a4a4a]"
            >
              Take Quiz
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => setIsDialogOpen(true)}
            className="hover:bg-red-400 rounded-lg hover:transition-all hover:delay-100 text-xs text-[#4a4a4a]"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white" onClick={handleDelete}>
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
};

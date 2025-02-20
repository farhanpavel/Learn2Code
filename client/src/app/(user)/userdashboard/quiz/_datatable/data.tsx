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
};

export const ActionsCell: React.FC<{ user: Book }> = ({ user }) => {
  const accessToken = Cookies.get("AccessToken");
  const { setbookData, bookData } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${url}/api/question/data/${user.Booktopic}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken || "",
          },
        }
      );

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
          <DropdownMenuItem
            onClick={() => {
              router.push(`/userdashboard/quiz/${user.Booktopic}`);
            }}
            className="hover:bg-green-400 rounded-lg hover:transition-all hover:delay-100 text-xs text-[#4a4a4a]"
          >
            View
          </DropdownMenuItem>
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

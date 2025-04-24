"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { PiUploadSimpleBold } from "react-icons/pi";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UploadDialogProps {
  onUploadSuccess: (newBook: any) => void;
}

export default function UploadDialog({ onUploadSuccess }: UploadDialogProps) {
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [book, setBook] = useState({
    Booktype: "PDF",
    Booktopic: "",
    status: "0",
  });
  const [file, setFile] = useState<File | null>(null);

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
      setLoading(false);
      return;
    }

    const accessToken = Cookies.get("AccessToken"); // Get token from cookies
    if (!accessToken) {
      alert("You are not authenticated!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
      formData.append("Booktype", book.Booktype);
      formData.append("Booktopic", book.Booktopic);
      formData.append("status", book.status);

      const response = await fetch(`${url}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: accessToken,
        },
        body: formData,
      });

      if (!response.ok) {
        alert("Server Error");
        throw new Error("Failed to upload file");
      } else {
        const uploadedBookData = await response.json();
        onUploadSuccess(uploadedBookData.data);
        // Reset form
        setBook({
          Booktype: "PDF",
          Booktopic: "",
          status: "0",
        });
        setFile(null);
        // Close dialog
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-x-1">
          <PiUploadSimpleBold className="text-white text-sm" />
          <span className="font-medium"> Upload Document</span>
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

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic" className="text-right">
              Topic
            </Label>
            <Input
              id="topic"
              name="Booktopic"
              value={book.Booktopic}
              type="text"
              className="col-span-3 border-gray-300 focus:ring-black focus:border-black"
              onChange={handleChange}
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
                className="border-gray-300 focus:ring-black focus:border-black"
                onChange={handleFileChange}
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
              onClick={() => setIsDialogOpen(false)}
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
  );
}

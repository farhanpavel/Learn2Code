"use client";
import React, { useState } from "react";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaTeamspeak } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "sonner"; // Assuming you're using Sonner for toast notifications
import { url } from "@/components/Url/page";

const DetailsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files.length || !jobTitle || !jobDescription) {
      toast.error("Please fill all fields and upload a resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]); // Ensure the file is appended correctly
      formData.append("jobTitle", jobTitle);
      formData.append("description", jobDescription);
      formData.append("difficulty", id);
      const response = await fetch(`${url}/api/data-extract`, {
        method: "POST",
        body: formData, // Send form data
      });

      if (!response.ok) {
        throw new Error("Failed to process data.");
      }

      const result = await response.json();
      alert("Resume uploaded and processed successfully!");
      router.push("/interview"); // Redirect to dashboard or another page
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <FaTeamspeak className="text-3xl" />
          <h1 className="text-2xl font-bold">Start Interview</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black  border-b-[2px] pb-4">
          Create a new interview here!
        </p>
        <div>
          <Card className="border-[1px] border-gray-300 bg-[#F0F4F4]">
            <div className="flex justify-between">
              <CardHeader className="space-y-4">
                <CardTitle>Interview Details</CardTitle>
                <div>
                  <h1 className="font-semibold text-sm">Enter Informations</h1>
                </div>
              </CardHeader>
            </div>

            <CardContent>
              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-xs mb-4 border-gray-500"
                    >
                      Upload Resume {files.length > 0 && `(${files.length})`}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Upload files</DialogTitle>
                      <DialogDescription>
                        Drag and drop your files here or click to browse.
                      </DialogDescription>
                    </DialogHeader>
                    <FileUploader
                      maxFileCount={1} // Only allow one file for resume
                      maxSize={8 * 1024 * 1024} // 8MB limit
                      onValueChange={(uploadedFiles) => {
                        setFiles(uploadedFiles);
                        if (uploadedFiles.length > 0) {
                          setOpen(false); // Close dialog after upload
                        }
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-5 ">
                    <div className="space-y-5 ">
                      <div className="space-y-2 ">
                        <Label className="text-xs w-" htmlFor="jobTitle">
                          Job Role
                        </Label>
                        <Input
                          id="jobTitle"
                          type="text"
                          className="w-1/3 border-[1px] bg-white border-black focus:ring-black"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2 ">
                        <Label className="text-xs w-" htmlFor="jobDescription">
                          Job Description
                        </Label>
                        <Textarea
                          id="jobDescription"
                          rows={7}
                          className="w-3/4 border-[1px] bg-white resize-none border-black focus:ring-black"
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-12">
                  <Button
                    type="submit"
                    className="bg-black text-white text-xs hover:bg-gray-500 hover:transition-all hover:delay-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DetailsPage;

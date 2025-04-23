"use client";
import React, { useState } from "react";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Upload,
  FileText,
  BriefcaseIcon,
  ScrollText,
} from "lucide-react";
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
import { toast } from "sonner";
import { url } from "@/components/Url/page";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const difficultyConfig = {
  fundamental: {
    title: "Fundamental Interview",
    description: "Basic concepts and entry-level questions",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  standard: {
    title: "Standard Interview",
    description: "Intermediate concepts and practical scenarios",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  classic: {
    title: "Classic Interview",
    description: "Advanced concepts and complex problem-solving",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

const DetailsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const difficulty = difficultyConfig[id as keyof typeof difficultyConfig];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files.length || !jobTitle || !jobDescription) {
      toast.error("Please fill all fields and upload a resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("jobTitle", jobTitle);
      formData.append("description", jobDescription);
      formData.append("difficulty", id);

      const response = await fetch(`${url}/api/data-extract`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process data.");

      toast.success("Resume uploaded and processed successfully!");
      router.push("/interview");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-full bg-primary/10">
            <FaTeamspeak className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {difficulty.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {difficulty.description}
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-8 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Interview Setup</CardTitle>
                <CardDescription>
                  Provide your details to begin the interview process
                </CardDescription>
              </div>
              <Badge className={`${difficulty.color} px-3 py-1`}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium" htmlFor="resume">
                    Resume
                  </Label>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1.5 h-20 border-dashed"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium">
                            {files.length
                              ? `Selected (${files.length})`
                              : "Upload Resume"}
                          </span>
                          <span className="text-xs text-gray-500">
                            PDF or DOC up to 8MB
                          </span>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle>Upload Resume</DialogTitle>
                        <DialogDescription>
                          Choose your resume file to upload
                        </DialogDescription>
                      </DialogHeader>
                      <FileUploader
                        maxFileCount={1}
                        maxSize={8 * 1024 * 1024}
                        onValueChange={(files) => {
                          setFiles(files);
                          if (files.length > 0) setOpen(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <Label className="text-sm font-medium" htmlFor="jobTitle">
                    Job Role
                  </Label>
                  <div className="relative mt-1.5">
                    <BriefcaseIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="jobTitle"
                      className="pl-10"
                      placeholder="e.g. Senior Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    className="text-sm font-medium"
                    htmlFor="jobDescription"
                  >
                    Job Description
                  </Label>
                  <div className="relative mt-1.5">
                    <ScrollText className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <Textarea
                      id="jobDescription"
                      className="pl-10 min-h-[150px]"
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailsPage;

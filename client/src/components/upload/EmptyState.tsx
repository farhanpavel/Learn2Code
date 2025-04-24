import React from "react";
import { Button } from "@/components/ui/button";
import { PiUploadSimpleBold } from "react-icons/pi";

interface EmptyStateProps {
  onUploadClick: () => void;
}

export default function EmptyState({ onUploadClick }: EmptyStateProps) {
  return (
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
        onClick={onUploadClick}
        className="bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-x-2"
      >
        <PiUploadSimpleBold className="text-white text-sm" />
        <span>Upload Your First Document</span>
      </Button>
    </div>
  );
}

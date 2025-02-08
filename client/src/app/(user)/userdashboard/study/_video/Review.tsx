"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReviewProps {
  review: string;
  getCode: () => string;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  return (
    <div className="p-4 ">
      <h2 className="text-xl font-bold">Review</h2>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {review || "No review available."}
      </ReactMarkdown>
    </div>
  );
};

export default Review;

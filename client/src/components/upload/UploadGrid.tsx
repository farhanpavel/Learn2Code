"use client";
import React from "react";
import UploadCard, { Book } from "./UploadCard";

interface UploadGridProps {
  books: Book[];
  onDelete: (id: string) => void;
  searchQuery: string;
}

export default function UploadGrid({
  books,
  onDelete,
  searchQuery,
}: UploadGridProps) {
  // Filter books based on search query
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.Booktopic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 rounded-lg">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-medium text-gray-700 mb-1">
          No documents found
        </h3>
        <p className="text-sm text-gray-500">
          {searchQuery
            ? "Try a different search term"
            : "Upload your first document to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredBooks.map((book) => (
        <UploadCard key={book._id} book={book} onDelete={onDelete} />
      ))}
    </div>
  );
}

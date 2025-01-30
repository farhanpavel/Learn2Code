"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { url } from "@/components/Url/page";
import * as pdfjsLib from "pdfjs-dist";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PdfViewer = ({
  pdfUrl,
  setSelectedText,
}: {
  pdfUrl: string;
  setSelectedText: (text: string) => void;
}) => {
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString().trim();
      if (selectedText) {
        setSelectedText(selectedText);
      }
    }
  };

  return (
    <div onMouseUp={handleTextSelection} className="h-[750px] w-full ">
      <Worker workerUrl={pdfjsLib.GlobalWorkerOptions.workerSrc}>
        <Viewer fileUrl={pdfUrl} defaultScale={SpecialZoomLevel.PageFit} />
      </Worker>
    </div>
  );
};

export default function Page() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [store, setStore] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loading2, setLoading2] = useState(false); // Add loading state
  const [selectedText, setSelectedText] = useState<string>("");
  const [summaryResult, setSummaryResult] = useState<string | null>(null); // To store the summary result
  useEffect(() => {
    const bookId = Cookies.get("Id");

    if (bookId) {
      const fetchPdfUrl = async () => {
        try {
          const response = await fetch(`${url}/api/pdfs/${bookId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch PDF URL");
          }
          const data = await response.json();
          setPdfUrl(data.pdfUrl);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching PDF:", error);
          setLoading(false);
        }
      };
      const fetchstoreData = async () => {
        try {
          const response = await fetch(`${url}/api/store`);
          if (!response.ok) {
            throw new Error("Failed to fetch PDF URL");
          }
          const data = await response.json();
          setStore(data.description);
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      };
      fetchstoreData();
      fetchPdfUrl();
    }
  }, []);

  const handleSubmit = async () => {
    setLoading2(true);
    console.log(store, selectedText);
    try {
      const response = await fetch(`${url}/api/analyze-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullPdfText: store,
          selectedLine: selectedText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze PDF");
      }

      const data = await response.json();
      setLoading2(false);
      setSummaryResult(data.result); // Assuming the API returns a "summary" field
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setLoading2(false);
    }
  };

  return (
    <div className="relative">
      {loading ? (
        <p>Loading PDF...</p>
      ) : pdfUrl ? (
        <PdfViewer pdfUrl={pdfUrl} setSelectedText={setSelectedText} />
      ) : (
        <p>No PDF found for this book.</p>
      )}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-2xl z-50 w-[90%] max-w-[600px]">
        <label
          htmlFor="selectedText"
          className="block mb-2 text-xs font-medium text-gray-700"
        >
          Selected Line:
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            id="selectedText"
            value={selectedText}
            onChange={(e) => setSelectedText(e.target.value)}
            placeholder="Selected line will appear here..."
            className="flex-grow p-2 border border-gray-300 rounded-lg "
          />
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-xs text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-blue-300"
            disabled={loading2}
          >
            {loading2 ? (
              <Loader2 className="animate-spin text-white" /> // Show loader if loading is true
            ) : (
              "Submit"
            )}
          </Button>
        </div>
        {summaryResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="font-bold text-sm text-gray-800">Summary:</h3>
            <p className="text-sm text-black-600">{summaryResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

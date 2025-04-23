"use client";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import * as pdfjsLib from "pdfjs-dist";
import html2canvas from "html2canvas";
import {
  Loader2,
  X,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  ImageIcon,
  Type,
} from "lucide-react";
import { url } from "@/components/Url/page";

const PdfViewer = ({
  pdfUrl,
  setSelectedText,
  setCapturedImage,
  scale = 1,
}: {
  pdfUrl: string;
  setSelectedText: (text: string) => void;
  setCapturedImage: (img: string | null) => void;
  scale?: number;
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  }, []);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const selectedText = selection.toString().trim();
      if (selectedText) {
        setSelectedText(selectedText);
        setCapturedImage(null);
      }
    }
  };

  const startSelection = (e: React.MouseEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    setIsSelecting(true);
    setIsDragging(true);
    const rect = viewerRef.current?.getBoundingClientRect();
    if (rect) {
      setSelectionCoords({
        x1: e.clientX - rect.left,
        y1: e.clientY - rect.top,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top,
      });
    }
  };

  const updateSelection = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = viewerRef.current?.getBoundingClientRect();
    if (rect) {
      setSelectionCoords((prev) => ({
        ...prev,
        x2: e.clientX - rect.left,
        y2: e.clientY - rect.top,
      }));
    }
  };

  const endSelection = async () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsSelecting(false);

    if (viewerRef.current) {
      const { x1, y1, x2, y2 } = selectionCoords;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      if (width > 10 && height > 10) {
        const canvas = await html2canvas(viewerRef.current, {
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width,
          height,
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const image = canvas.toDataURL("image/png");
        setCapturedImage(image);
        setSelectedText("");
      }
    }
  };

  return (
    <div
      ref={viewerRef}
      onMouseDown={startSelection}
      onMouseMove={updateSelection}
      onMouseUp={() => {
        handleTextSelection();
        endSelection();
      }}
      onMouseLeave={endSelection}
      className="h-[calc(150vh-10px)] w-full relative bg-gray-50"
    >
      <Worker workerUrl={pdfjsLib.GlobalWorkerOptions.workerSrc}>
        <Viewer
          fileUrl={pdfUrl}
          defaultScale={SpecialZoomLevel.PageFit}
          scale={scale}
        />
      </Worker>

      {isSelecting && (
        <div
          className="absolute border-2 border-black bg-black/10 pointer-events-none"
          style={{
            left: `${Math.min(selectionCoords.x1, selectionCoords.x2)}px`,
            top: `${Math.min(selectionCoords.y1, selectionCoords.y2)}px`,
            width: `${Math.abs(selectionCoords.x2 - selectionCoords.x1)}px`,
            height: `${Math.abs(selectionCoords.y2 - selectionCoords.y1)}px`,
          }}
        />
      )}
    </div>
  );
};

export default function Page() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [store, setStore] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const bookId = Cookies.get("Id");
    if (bookId) {
      Promise.all([
        fetch(`${url}/api/pdfs/${bookId}`).then((res) => res.json()),
        fetch(`${url}/api/store`).then((res) => res.json()),
      ])
        .then(([pdfData, storeData]) => {
          setPdfUrl(pdfData.pdfUrl);
          setStore(storeData.description);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, []);

  const handleClear = () => {
    setSelectedText("");
    setCapturedImage(null);
    setSummaryResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedText && !capturedImage) {
      setToast("Please select text or capture an image first");
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("fullPdfText", store || "");

      if (selectedText) {
        formData.append("selectedText", selectedText);
      }

      if (capturedImage) {
        const blob = await fetch(capturedImage).then((res) => res.blob());
        formData.append("image", blob, "capture.png");
      }

      const response = await fetch(`${url}/api/analyze-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze PDF");
      const data = await response.json();
      setSummaryResult(data.result);
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      setToast("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Zoom Controls */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-50 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm font-medium w-16 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-700"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      {pdfUrl ? (
        <PdfViewer
          pdfUrl={pdfUrl}
          setSelectedText={setSelectedText}
          setCapturedImage={setCapturedImage}
          scale={scale}
        />
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-180px)] bg-gray-50">
          <p className="text-gray-500">No PDF found for this book</p>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-xl p-6 rounded-xl z-50 w-[90%] max-w-[600px] border border-gray-200">
        {capturedImage && (
          <div className="mb-4 relative group">
            <img
              src={capturedImage}
              alt="Selected area"
              className="max-h-40 w-full rounded-lg border border-gray-200 object-contain bg-gray-50"
            />
            <button
              onClick={() => setCapturedImage(null)}
              className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          {capturedImage ? (
            <ImageIcon size={16} className="text-gray-600" />
          ) : (
            <Type size={16} className="text-gray-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {capturedImage ? "Image Analysis" : "Text Analysis"}
          </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={selectedText}
              onChange={(e) => setSelectedText(e.target.value)}
              placeholder={
                capturedImage
                  ? "Add context for the image (optional)..."
                  : "Select text or Ctrl/Cmd+drag to capture image..."
              }
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 bg-white text-gray-900 placeholder-gray-400"
            />
            {(selectedText || capturedImage) && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={analyzing || (!selectedText && !capturedImage)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              analyzing || (!selectedText && !capturedImage)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {analyzing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Analyze"
            )}
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          {capturedImage
            ? "Image captured - add optional context above"
            : "Select text normally or hold Ctrl/Cmd and drag to capture an image"}
        </p>

        {summaryResult && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Analysis Results</h3>
            <p
              className={`text-gray-700 whitespace-pre-wrap ${
                !expanded && summaryResult.length > 150 ? "line-clamp-3" : ""
              }`}
            >
              {summaryResult}
            </p>
            {summaryResult.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {expanded ? "See Less" : "See More"}
              </button>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right">
          {toast}
        </div>
      )}
    </div>
  );
}

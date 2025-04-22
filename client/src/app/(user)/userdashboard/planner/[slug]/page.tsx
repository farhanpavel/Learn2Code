"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { url } from "@/components/Url/page";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import Link from "next/link";
export default function Page() {
  const params = useParams();
  const slug = params.slug;
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const [resources, setResources] = useState({
    youtubeUrl: "",
    description: "",
    codeExamples: "",
    documentationLinks: "",
    loading: true,
    error: null as string | null,
  });

  // Refs to manage the typing states for each stream
  const descriptionQueue = useRef<string[]>([]);
  const isTypingDescription = useRef(false);
  const descriptionTimeout = useRef<NodeJS.Timeout | null>(null);

  const codeQueue = useRef<string[]>([]);
  const isTypingCode = useRef(false);
  const codeTimeout = useRef<NodeJS.Timeout | null>(null);

  const docsQueue = useRef<string[]>([]);
  const isTypingDocs = useRef(false);
  const docsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Function to process the description queue
  const processDescriptionQueue = () => {
    if (descriptionQueue.current.length === 0) {
      isTypingDescription.current = false;
      return;
    }

    isTypingDescription.current = true;
    const chunk = descriptionQueue.current.shift()!;

    setResources((prev) => ({
      ...prev,
      description: prev.description + chunk,
    }));

    descriptionTimeout.current = setTimeout(processDescriptionQueue, 30);
  };

  // Function to process the code queue
  const processCodeQueue = () => {
    if (codeQueue.current.length === 0) {
      isTypingCode.current = false;
      return;
    }

    isTypingCode.current = true;
    const chunk = codeQueue.current.shift()!;

    setResources((prev) => ({
      ...prev,
      codeExamples: prev.codeExamples + chunk,
    }));

    codeTimeout.current = setTimeout(processCodeQueue, 30);
  };

  // Function to process the docs queue
  const processDocsQueue = () => {
    if (docsQueue.current.length === 0) {
      isTypingDocs.current = false;
      return;
    }

    isTypingDocs.current = true;
    const chunk = docsQueue.current.shift()!;

    setResources((prev) => ({
      ...prev,
      documentationLinks: prev.documentationLinks + chunk,
    }));

    docsTimeout.current = setTimeout(processDocsQueue, 30);
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (descriptionTimeout.current) clearTimeout(descriptionTimeout.current);
      if (codeTimeout.current) clearTimeout(codeTimeout.current);
      if (docsTimeout.current) clearTimeout(docsTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!title) return;

    const eventSource = new EventSource(
      `${url}/api/resources/stream?title=${encodeURIComponent(title)}`
    );

    eventSource.onopen = () => {
      console.log("SSE connection opened");
      setResources((prev) => ({ ...prev, loading: true, error: null }));
    };

    eventSource.addEventListener("youtube", (event) => {
      try {
        console.log("Raw YouTube event data:", event.data);
        const data = JSON.parse(event.data);
        setResources((prev) => ({
          ...prev,
          youtubeUrl: data.url || "",
        }));
      } catch (err) {
        console.error(
          "Error parsing YouTube data:",
          err,
          "Raw data:",
          event.data
        );
        setResources((prev) => ({
          ...prev,
          error: `Failed to parse YouTube data: ${err.message}`,
          loading: false,
        }));
      }
    });

    eventSource.addEventListener("description", (event) => {
      try {
        console.log("Raw description event data:", event.data);
        const data = JSON.parse(event.data);
        if (data.chunk) {
          // Add the entire chunk to the queue
          descriptionQueue.current.push(data.chunk);

          // Start processing if not already typing
          if (!isTypingDescription.current) {
            processDescriptionQueue();
          }
        }
      } catch (err) {
        console.error(
          "Error parsing description:",
          err,
          "Raw data:",
          event.data
        );
        setResources((prev) => ({
          ...prev,
          error: `Failed to parse description: ${err.message}`,
          loading: false,
        }));
      }
    });

    eventSource.addEventListener("code", (event) => {
      try {
        console.log("Raw code event data:", event.data);
        const data = JSON.parse(event.data);
        if (data.chunk) {
          codeQueue.current.push(data.chunk);
          if (!isTypingCode.current) {
            processCodeQueue();
          }
        }
      } catch (err) {
        console.error(
          "Error parsing code examples:",
          err,
          "Raw data:",
          event.data
        );
        setResources((prev) => ({
          ...prev,
          error: `Failed to parse code examples: ${err.message}`,
          loading: false,
        }));
      }
    });

    eventSource.addEventListener("docs", (event) => {
      try {
        console.log("Raw docs event data:", event.data);
        const data = JSON.parse(event.data);
        if (data.chunk) {
          docsQueue.current.push(data.chunk);
          if (!isTypingDocs.current) {
            processDocsQueue();
          }
        }
      } catch (err) {
        console.error(
          "Error parsing documentation:",
          err,
          "Raw data:",
          event.data
        );
        setResources((prev) => ({
          ...prev,
          error: `Failed to parse documentation: ${err.message}`,
          loading: false,
        }));
      }
    });

    eventSource.addEventListener("complete", () => {
      console.log("Stream complete");
      setResources((prev) => ({ ...prev, loading: false }));
      eventSource.close();
    });

    eventSource.addEventListener("error", (event) => {
      try {
        console.log("Raw error event data:", event.data);
        const data = JSON.parse(event.data);
        setResources((prev) => ({
          ...prev,
          error: data.error || "Stream error occurred",
          loading: false,
        }));
      } catch (err) {
        console.error(
          "Error parsing error event:",
          err,
          "Raw data:",
          event.data
        );
        setResources((prev) => ({
          ...prev,
          error: `Failed to process stream: ${err.message}`,
          loading: false,
        }));
      }
      eventSource.close();
    });

    eventSource.onerror = () => {
      console.error("SSE connection error");
      setResources((prev) => ({
        ...prev,
        error: "Connection to stream failed",
        loading: false,
      }));
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [title]);

  // Extract YouTube video ID for iframe
  const youtubeVideoId = resources.youtubeUrl?.match(/v=([^&]+)/)?.[1] || "";

  return (
    <div className="p-10 overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold">Roadmap: {title}</h1>

        {resources.loading && (
          <div className="flex items-center gap-2 mb-6">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <span>Generating learning resources...</span>
          </div>
        )}

        {resources.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {resources.error}
          </div>
        )}
        <section className="mb-8 mt-7">
          <div className="bg-white p-6 rounded-lg shadow">
            {youtubeVideoId ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-96 rounded-md"
                ></iframe>
              </div>
            ) : (
              <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        </section>
        {/* Description Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">About {title}</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {resources.description ? (
              <p className="whitespace-pre-line">{resources.description}</p>
            ) : (
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        </section>

        {/* YouTube Video Section */}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {resources.codeExamples ? (
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={{
                  pre({ node, className, children, ...props }) {
                    return (
                      <pre
                        className={`${className} bg-gray-100 p-4 rounded overflow-x-auto text-sm`}
                        {...props}
                      >
                        {children}
                      </pre>
                    );
                  },
                  code({ node, inline, className, children, ...props }) {
                    return (
                      <code className={`${className} font-mono`} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {`\`\`\`${resources.language || "python"}\n${
                  resources.codeExamples
                }\n\`\`\``}
              </ReactMarkdown>
            ) : (
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        </section>

        {/* Documentation Section with Link Handling */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {resources.documentationLinks ? (
              <ReactMarkdown
                components={{
                  a({ node, href, children, ...props }) {
                    if (!href) {
                      return <a {...props}>{children}</a>;
                    }
                    return (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        {...props}
                      >
                        {children}
                      </Link>
                    );
                  },
                  p({ node, children, ...props }) {
                    return (
                      <p className="mb-4" {...props}>
                        {children}
                      </p>
                    );
                  },
                  ul({ node, children, ...props }) {
                    return (
                      <ul className="list-disc pl-5 mb-4" {...props}>
                        {children}
                      </ul>
                    );
                  },
                  li({ node, children, ...props }) {
                    return (
                      <li className="mb-2" {...props}>
                        {children}
                      </li>
                    );
                  },
                }}
                className="prose max-w-none"
              >
                {resources.documentationLinks}
              </ReactMarkdown>
            ) : (
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PieData from "@/components/PieChart/page";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { url } from "@/components/Url/page";

export default function Dashboard() {
  const [quizCount, setQuizCount] = useState(0);
  const [pdfCount, setPdfCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("AccessToken") || "";

      try {
        // Fetch quiz data
        const quizResponse = await fetch(`${url}/api/question/data`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!quizResponse.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const quizData = await quizResponse.json();
        setQuizCount(quizData.length); // Assuming the response is an array of quizzes

        // Fetch PDF data
        const pdfResponse = await fetch(`${url}/api/pdfs`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!pdfResponse.ok) {
          throw new Error("Failed to fetch PDF data");
        }
        const pdfData = await pdfResponse.json();
        setPdfCount(pdfData.length); // Assuming the response is an array of PDFs
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-1 flex-col space-y-2 p-10">
        <div className="flex items-center justify-between space-y-2 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <div className="flex justify-around space-x-2 ">
          <Card className="bg-white w-1/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Quizzes Taken
              </CardTitle>
              <IoIosCheckmarkCircleOutline />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizCount}</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white w-1/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mock Interviews Given
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white w-1/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Videos Watched
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50 Hours</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-black w-1/4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-white">
              <CardTitle className="text-sm font-medium">
                Documents Uploaded
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground text-white"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-2xl font-bold">{pdfCount}</div>
              <p className="text-xs text-muted-foreground text-white">
                +2 since last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-white">
          <PieData />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { url } from "@/components/Url/page";
interface EvaluationData {
  mark: number;
  suggestion: string;
}
const InterviewEvaluationPage = () => {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Initialize the router
  useEffect(() => {
    // Make a POST request to store evaluation
    fetch(`${url}/api/store-evaluation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        setEvaluation(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching evaluation data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-xl">
          <h1 className="text-4xl font-bold mb-8 text-white">
            Loading Evaluation...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-xl w-full max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-white">
          Interview Evaluation
        </h1>
        <div className="space-y-8">
          {/* Display evaluation mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white">
              Marks: {evaluation?.mark ?? "N/A"}/10
            </h2>
            <p className="text-lg text-white/90 leading-relaxed mt-4">
              Your performance has been evaluated based on the interview
              questions.
            </p>
          </motion.div>

          {/* Display suggestions for improvement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-white">
              Suggestions for Improvement
            </h2>
            <p className="text-lg text-white/90 leading-relaxed mt-4">
              {evaluation?.suggestion ?? "No specific suggestions provided."}
            </p>
          </motion.div>

          {/* Button to go back */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={() => router.push("/userdashboard/overview")} // Go back to the previous page
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              Next
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewEvaluationPage;

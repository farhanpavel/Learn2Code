"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { url } from "@/components/Url/page";
import { Mic, SkipForward, Volume2, VolumeX, CheckCircle } from "lucide-react";
import "dotenv/config";

export default function InterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timer, setTimer] = useState(120);
  const [countdown, setCountdown] = useState(5);
  const [isMicActive, setIsMicActive] = useState(false);
  const [inputText, setInputText] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter();
  const audioRef = useRef(null);

  const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
  const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${url}/api/data-extract`);
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const newTranscript =
          event.results[event.results.length - 1][0].transcript;
        setInputText((prev) => prev + " " + newTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Speech Recognition is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    if (isCountdownActive) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(countdownInterval);
        setIsCountdownActive(false);
        nextQuestion();
      }

      return () => clearInterval(countdownInterval);
    }
  }, [countdown, isCountdownActive]);

  const speakQuestion = async (text) => {
    if (!text) return;

    try {
      setIsSpeaking(true);
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: text,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate speech");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }

      audioRef.current.onended = () => {
        setIsSpeaking(false);
      };
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  const nextQuestion = async () => {
    stopSpeaking();

    // Send the current response to the API
    if (currentQuestion && inputText.trim() !== "") {
      const questionId = questions[currentQuestionIndex]._id; // Assuming each question has an _id field
      await sendResponseToAPI(questionId, inputText);
    }

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const newQuestion = questions[nextIndex].question;
      setCurrentQuestion(newQuestion);
      setTimer(120);
      setIsMicActive(false);
      setInputText("");
      speakQuestion(newQuestion);
    } else {
      router.push("/interview/result");
    }
  };

  const sendResponseToAPI = async (questionId, response) => {
    try {
      console.log(response);
      const apiUrl = `${url}/api/data-extract/${questionId}`;
      const responseData = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: response }),
      });

      if (!responseData.ok) {
        throw new Error("Failed to send response to API");
      }

      const result = await responseData.json();
      console.log("Response sent successfully:", result);
    } catch (error) {
      console.error("Error sending response to API:", error);
    }
  };
  useEffect(() => {
    if (!isCountdownActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      nextQuestion();
    }
  }, [timer, isCountdownActive]);

  const handleMicClick = () => {
    if (recognition) {
      if (!isMicActive) {
        setIsMicActive(true);
        recognition.start();
      } else {
        setIsMicActive(false);
        recognition.stop();
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-6">
      <audio ref={audioRef} />

      {isCountdownActive ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-xl">
            <h1 className="text-4xl font-bold mb-8 text-white">
              Preparing Your Interview
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            >
              {countdown}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3"
            >
              <span className="text-white/60">Question</span>
              <span className="text-white ml-2 font-medium">
                {currentQuestionIndex}/{questions.length - 1}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-3"
            >
              <span className="text-white/60">Time Left</span>
              <span className="text-white ml-2 font-medium">
                {formatTime(timer)}
              </span>
            </motion.div>
          </div>

          {currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Interview Question
                </h2>
                <button
                  onClick={
                    isSpeaking
                      ? stopSpeaking
                      : () => speakQuestion(currentQuestion)
                  }
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {isSpeaking ? (
                    <Volume2 className="w-6 h-6 text-white" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
              <p className="text-lg text-white/90 leading-relaxed">
                {currentQuestion}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <textarea
              className="w-full h-40 bg-white/5 backdrop-blur-lg rounded-xl p-6 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-white/30"
              placeholder="Your answer will appear here as you speak..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMicClick}
                disabled={isSpeaking}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                  ${
                    isMicActive
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }
                  ${
                    isSpeaking
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg"
                  }
                `}
              >
                <Mic className="w-5 h-5" />
                {isMicActive ? "Stop Recording" : "Start Recording"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
                  ${
                    isLastQuestion
                      ? "bg-green-500 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }
                `}
              >
                {isLastQuestion ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Finish Interview
                  </>
                ) : (
                  <>
                    <SkipForward className="w-5 h-5" />
                    Next Question
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

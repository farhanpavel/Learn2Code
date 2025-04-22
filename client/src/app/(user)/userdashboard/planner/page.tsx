"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Loader2,
  BookOpen,
  GraduationCap,
  Trophy,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { url } from "@/components/Url/page";

const FEATURED_TOPICS = [
  {
    title: "Web Development",
    image: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg",
    description: "Master modern web technologies and frameworks",
  },
  {
    title: "Data Science",
    image: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg",
    description: "Learn statistics, machine learning, and data analysis",
  },
  {
    title: "Digital Marketing",
    image: "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg",
    description: "Explore SEO, social media, and content marketing",
  },
];

const PlannerPage = () => {
  const [query, setQuery] = useState<string>("");
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const generatePlan = async (topic: string = query) => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${url}/api/planner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: topic }),
      });

      const data = await res.json();
      setTitles(data.titles || []);
      setSelectedTopic(topic);
    } catch (err) {
      console.error("Error fetching titles:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <GraduationCap className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Learning Journey Starts Here
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Generate personalized learning roadmaps powered by AI to master
              any skill or topic
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <Card className="p-8 shadow-lg border-2 border-black/10 bg-white mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="What do you want to learn?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg border-2 border-black/20 focus-visible:ring-black"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && query.trim()) {
                  generatePlan();
                }
              }}
            />
            <Button
              onClick={() => generatePlan()}
              disabled={loading || !query.trim()}
              className="bg-black hover:bg-gray-800 text-white text-lg py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Roadmap
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Featured Topics */}
        {!titles.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8">Popular Learning Paths</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURED_TOPICS.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    onClick={() => generatePlan(topic.title)}
                  >
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{topic.description}</p>
                      <Button
                        variant="outline"
                        className="w-full border-2 border-black hover:bg-black hover:text-white"
                      >
                        Generate Path
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Roadmap Results */}
        {titles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <Target className="h-8 w-8" />
              <h2 className="text-2xl font-bold">
                Learning Path: {selectedTopic}
              </h2>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {titles.map((title, index) => {
                  const cleanTitle = title.replace(/^title:\s*/, "");
                  const slug = cleanTitle.toLowerCase().replace(/\s+/g, "-"); // slugify
                  const router = useRouter();

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() =>
                        router.push(
                          `/userdashboard/planner/${slug}?title=${encodeURIComponent(
                            cleanTitle
                          )}`
                        )
                      }
                      className="cursor-pointer"
                    >
                      <Card className="p-6 border-2 border-black/10 hover:border-black/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {cleanTitle}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                              <BookOpen className="h-4 w-4" />
                              <span>Essential Step</span>
                              <CheckCircle2 className="h-4 w-4 ml-2" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {titles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: titles.length * 0.1 }}
                  className="flex items-center justify-center mt-8"
                >
                  <div className="flex items-center gap-3 text-gray-600">
                    <Trophy className="h-6 w-6" />
                    <span className="text-lg">
                      Complete these steps to master {selectedTopic}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlannerPage;

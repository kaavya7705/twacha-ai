"use client";

import type React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface AnalysisResultsPageProps {
  imageUrl: string;
  results: Array<{
    class: number;
    confidence: number;
    problem: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>;
  predictedProblems: string[];
  recommendations: string;
}

const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = ({
  imageUrl,
  results,
  predictedProblems,
  recommendations,
}) => {
  // Filter results to include only unique problems
  const uniqueResults = results.filter(
    (result, index, self) =>
      index === self.findIndex((r) => r.problem === result.problem)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-pink-700 my-8 text-center"
      >
        Your Skin Analysis Results
      </motion.h1>

      <div className="max-w-6xl w-full px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section with Bounding Boxes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative w-[600px] h-[600px]">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Analyzed Skin"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
            {results.length > 0 &&
              results.map((result, index) => {
                const centerX = (result.x1 + result.x2) / 2;
                const centerY = (result.y1 + result.y2) / 2;
                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      left: `${(centerX / 600) * 100}%`,
                      top: `${(centerY / 600) * 100}%`,
                      transform: "translate(-100%, 400%)",
                    }}
                  >
                    <div className="relative group">
                      <div className="w-3 h-3 bg-white rounded-full border-2 border-pink-500"></div>
                      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform bg-white border border-pink-500 p-2 rounded z-10 whitespace-nowrap">
                        {result.problem} -{" "}
                        {(result.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Analysis Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            Detected Issues
          </h2>

          {predictedProblems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {uniqueResults.map((result, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-24 h-24 mb-2">
                    <CircularProgressbar
                      value={result.confidence * 100} // Uses actual confidence instead of random %
                      text={`${result.problem}`}
                      styles={buildStyles({
                        textSize: "12px",
                        pathColor: "#FF69B4",
                        textColor: "#FF69B4",
                        trailColor: "#FFF0F5",
                      })}
                    />
                  </div>
                  <span className="text-sm text-pink-700 text-center">
                    {result.problem}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No significant issues detected.</p>
          )}
        </motion.div>
      </div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="max-w-4xl w-full mt-12 px-4"
      >
        <h2 className="text-2xl font-semibold text-pink-600 mb-4">
          Recommendations
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {recommendations ? (
            <ReactMarkdown className="prose prose-pink max-w-none">
              {recommendations}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500">No recommendations available.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisResultsPage;

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Camera } from "lucide-react"
import { ImageUploader } from "../components/image-uploader"

export default function Home() {
  const [showUploader, setShowUploader] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Discover Your</span>
                <span className="block text-pink-600">Perfect Skincare</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Upload your photo and let our AI analyze your skin. Get personalized skincare recommendations based on
                your unique needs.
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700" onClick={() => setShowUploader(true)}>
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <div className="relative mx-auto w-full max-w-md lg:max-w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="rounded-full overflow-hidden shadow-xl"
                >
                  <Image
                    src="/placeholder.svg?height=400&width=400"
                    alt="Face Analysis"
                    width={400}
                    height={400}
                    className="w-full h-auto"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-4"
                >
                  <p className="text-sm font-medium text-gray-900">AI-Powered Skin Analysis</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: "Upload Photo", icon: <Upload className="h-8 w-8 text-pink-500" /> },
              { title: "AI Analysis", icon: <Camera className="h-8 w-8 text-pink-500" /> },
              { title: "Get Recommendations", icon: <ArrowRight className="h-8 w-8 text-pink-500" /> },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center items-center w-16 h-16 mx-auto bg-pink-100 rounded-full">
                  {step.icon}
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Uploader Modal */}
      <AnimatePresence>{showUploader && <ImageUploader onClose={() => setShowUploader(false)} />}</AnimatePresence>
    </div>
  )
}


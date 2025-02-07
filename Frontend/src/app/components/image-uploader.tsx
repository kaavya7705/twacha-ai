"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, Camera, X } from "lucide-react"
import AnalysisResult from "./AnalysisResult"

interface ImageUploaderProps {
  onClose: () => void
  onSubmit: (data: { image: string | null; age: string; gender: string; imageUrl: string | null }) => void
}

export function ImageUploader({ onClose, onSubmit }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null)
  const [isCaptureMode, setIsCaptureMode] = useState(false)
  const [age, setAge] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [showAgeGender, setShowAgeGender] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setIsCaptureMode(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCapture = async () => {
    if (isCaptureMode && videoRef.current) {
      const canvas = document.createElement("canvas")
      const video = videoRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext("2d")?.drawImage(video, 0, 0)

      const imageDataUrl = canvas.toDataURL("image/jpeg") // Convert to Base64
      setImage(imageDataUrl)

      stopCamera()
      setIsCaptureMode(false)
    } else {
      setIsCaptureMode(true)
      setImage(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleContinue = () => {
    if (image) {
      setShowAgeGender(true)
    }
  }

  const handleSubmit = async () => {
    if (image && age && gender) {
      setIsLoading(true)
      const formData = new FormData()

      if (image.startsWith("data:image")) {
        const byteCharacters = atob(image.split(",")[1])
        const byteArrays = []
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i))
        }
        const byteArray = new Uint8Array(byteArrays)
        const blob = new Blob([byteArray], { type: "image/jpeg" })

        formData.append("image", blob, "captured.jpg")
      } else {
        formData.append("image", image)
      }

      formData.append("age", age.toString())
      formData.append("gender", gender)

      try {
        const response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload data")
        }

        const result = await response.json()
        console.log("Server Response:", result)

        // Include the image URL in the analysis results
        const analysisResults = {
          ...result,
          imageUrl: image,
        }

        onSubmit(analysisResults)
      } catch (error) {
        console.error("Error uploading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-pink-700">Upload Your Photo</h2>
          <button onClick={onClose} className="text-pink-500 hover:text-pink-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {!showAgeGender ? (
          <>
            {image ? (
              <div className="mb-4">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-pink-200">
                  <img src={image || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : isCaptureMode ? (
              <div className="mb-4">
                <video ref={videoRef} autoPlay className="w-full rounded-lg border-4 border-pink-200" />
              </div>
            ) : (
              <div className="mb-4 border-2 border-dashed border-pink-300 rounded-lg p-4 text-center">
                <p className="text-pink-500">Upload or capture your photo</p>
              </div>
            )}

            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCaptureMode}
                className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                  isCaptureMode ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <button
                onClick={handleCapture}
                disabled={!!image && !isCaptureMode}
                className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                  !!image && !isCaptureMode ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                <Camera className="h-5 w-5 mr-2" />
                {isCaptureMode ? "Capture" : "Camera"}
              </button>
            </div>

            {image && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setImage(null)}
                  className="px-4 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-50"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                >
                  Continue
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-pink-700">
                Age
              </label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="mt-1 block w-full px-3 py-2 bg-white border border-pink-300 rounded-md text-sm shadow-sm placeholder-pink-400
                          focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-pink-700">Gender</span>
              <div className="mt-2 space-y-2">
                {["Male", "Female", "Other"].map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-pink-600"
                      name="gender"
                      value={option.toLowerCase()}
                      checked={gender === option.toLowerCase()}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <span className="ml-2 text-pink-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAgeGender(false)}
                className="px-4 py-2 border border-pink-500 text-pink-500 rounded-md hover:bg-pink-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!age || !gender}
                className={`px-4 py-2 rounded-md text-white ${
                  !age || !gender ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        {(isLoading || analysisResult) && (
          <AnalysisResult
            isLoading={isLoading}
            result={analysisResult}
            onClose={() => {
              setAnalysisResult(null)
              onClose()
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}


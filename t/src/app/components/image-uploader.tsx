"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, Camera, X } from "lucide-react"

export function ImageUploader({ onClose }: { onClose: () => void }) {
  const [image, setImage] = useState<string | null>(null)
  const [isCaptureMode, setIsCaptureMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCapture = async () => {
    if (isCaptureMode && videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
      const imageDataUrl = canvas.toDataURL("image/jpeg")
      setImage(imageDataUrl)
      setIsCaptureMode(false)
      stopCamera()
    } else {
      setIsCaptureMode(true)
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
    // TODO: Implement backend integration
    console.log("Image ready for backend processing:", image)
    onClose()
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
          <h2 className="text-2xl font-bold">Upload Your Photo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {image ? (
          <div className="mb-4">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden">
              <img src={image || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-cover" />
            </div>
          </div>
        ) : isCaptureMode ? (
          <div className="mb-4">
            <video ref={videoRef} autoPlay className="w-full rounded-lg" />
          </div>
        ) : (
          <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500">Upload or capture your photo</p>
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-6 py-2 text-base font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
          <button
            onClick={handleCapture}
            className="inline-flex items-center px-6 py-2 text-base font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <Camera className="h-5 w-5 mr-2" />
            {isCaptureMode ? "Capture" : "Camera"}
          </button>
        </div>

        {image && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setImage(null)}
              className="inline-flex items-center px-6 py-2 text-base font-medium text-pink-600 bg-white border border-pink-600 rounded-md hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="inline-flex items-center px-6 py-2 text-base font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Continue
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

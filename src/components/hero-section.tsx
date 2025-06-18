"use client"

import { motion } from "framer-motion"
import { SplineScene } from "@/components/ui/spline"
import { Spotlight } from "@/components/ui/spotlight"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, Brain } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-10" />

      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal" patternUnits="userSpaceOnUse" width="60" height="60">
              <path d="M0,60 L60,0" stroke="#ffffff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal)" />
        </svg>
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

      <div className="w-full relative z-10">
        <div className="grid lg:grid-cols-5 min-h-screen">
          {/* Left Content - Takes up 2 columns */}
          <motion.div
            className="lg:col-span-2 flex flex-col justify-center px-6 lg:px-12 xl:px-16 py-12 lg:py-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-xl space-y-8">
              <Badge variant="outline" className="border-gray-600 text-gray-300 w-fit">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Financial Intelligence
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
                One dashboard. <br />
                <span className="text-gray-400">Every financial move.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                Upload your business documents and FinEx builds an intelligent control panel — including live competitor
                tracking, SEC changes, and budget breakdowns.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Financials
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Takes up 3 columns for more space */}
          <motion.div
            className="lg:col-span-3 relative min-h-[70vh] lg:min-h-screen"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 3D Robot Container - Full height */}
            <div id="finex-bot" className="w-full h-full relative">
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />

              {/* FinEx Company Name above robot */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-3">
                  <span className="text-white text-2xl font-bold tracking-wide">FinEx</span>
                </div>
              </div>

              {/* Subtle overlay elements for context */}
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-10 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium">Live Processing</span>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2">
                  <span className="text-gray-300 text-sm font-mono">FinEx AI</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-400 text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

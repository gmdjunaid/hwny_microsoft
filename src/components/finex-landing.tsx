"use client"

import { motion } from "framer-motion"
import { SplineScene } from "@/components/ui/spline"
// import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Upload,
  Brain,
} from "lucide-react"

export default function FinexLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-10" />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <h1 className="text-4xl font-bold">FinEx</h1>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Financial Intelligence
              </Badge>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                One dashboard. <span className="text-gray-400">Every financial move.</span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                Upload your business documents and Finex builds an intelligent control panel — including live competitor
                tracking, SEC changes, and budget breakdowns.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Financials
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 hover:bg-white/5">
                  View Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-gray-400">Companies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">$2.4B</div>
                  <div className="text-sm text-gray-400">Assets Tracked</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - 3D Scene */}
            <motion.div
              className="relative h-[600px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div id="finex-bot" className="w-full h-full">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold">Ready to transform your financial intelligence?</h2>
            <p className="text-xl text-gray-400">
              Join hundreds of businesses already using Finex to make smarter financial decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                <Upload className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 hover:bg-white/5">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { SplineScene } from "@/components/ui/spline"
import { Spotlight } from "@/components/ui/spotlight"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Upload,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Database,
  Brain,
  FileText,
  DollarSign,
} from "lucide-react"

export default function FinexLanding() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-10" />

        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

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

      {/* Why Choose Finex Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">Why Businesses Choose Finex?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A smarter way to manage financial intelligence with less effort, and more accuracy.
            </p>
          </motion.div>

          {/* Advantage 01 - Document Intelligence */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-sm text-gray-500 font-mono">ADVANTAGE / 01</div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-bold">Intelligence, Not Just Data</h3>
                  <p className="text-lg text-gray-400">
                    Finex transforms your financial documents into actionable insights, so you can stay focused on
                    growing your business.
                  </p>
                  <Button variant="outline" className="border-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm border border-teal-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-black" />
                      </div>
                      <span className="font-semibold">Instant Analysis</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Upload handles document processing and analysis so you can stay focused on your business
                      decisions.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Advantage 02 - Smart Analytics */}
          <motion.div
            className="mb-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 p-8 relative overflow-hidden">
                <div className="absolute top-4 left-4 text-sm text-gray-500 font-mono">ADVANTAGE / 02</div>

                <div className="space-y-6 mt-8">
                  <h3 className="text-3xl font-bold">Smart Analytics</h3>
                  <p className="text-gray-400">
                    AI and expert oversight keep you compliant and improve your bottom line.
                  </p>

                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-teal-400" />
                      <span className="font-medium">Monthly Financial Summary</span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>📅 Period: April 1-30, 2024</div>
                      <div>🏢 Business Name: Example Co.</div>
                    </div>
                    <div className="text-sm">
                      Your business generated a total revenue of{" "}
                      <span className="text-teal-400 font-semibold">$48,234</span> in April, with expenses of{" "}
                      <span className="text-red-400">$32,891</span>.
                    </div>
                    <Button size="sm" variant="ghost" className="text-teal-400 hover:bg-teal-400/10">
                      Using AI
                    </Button>
                  </div>

                  <Button variant="outline" className="border-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 p-8 relative overflow-hidden">
                <div className="absolute top-4 left-4 text-sm text-gray-500 font-mono">ADVANTAGE / 03</div>

                <div className="space-y-6 mt-8">
                  <h3 className="text-3xl font-bold">Real-time Visibility</h3>
                  <p className="text-gray-400">See accurate reports and insights the moment you need them.</p>

                  <div className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-lg p-4 border border-teal-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-black" />
                      </div>
                      <span className="font-medium">Quarterly Tax Overview</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>📊 Period: January 1-March 31</div>
                      <div>💼 Business Name: Example Co.</div>
                      <div className="pt-2 text-teal-400">
                        Estimated tax liability: <span className="font-semibold">$12,450</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="border-gray-600">
                    <Shield className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Advantage 04 - Easy Integrations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-sm text-gray-500 font-mono">ADVANTAGE / 04</div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl lg:text-4xl font-bold">Easy Integrations</h3>
                  <p className="text-lg text-gray-400">Just fast, secure connections to the tools you already use.</p>
                  <Button variant="outline" className="border-gray-600">
                    <Database className="w-4 h-4 mr-2" />
                    View Integrations
                  </Button>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-3 gap-6 items-center">
                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">DB</span>
                      </div>
                      <span className="text-sm text-gray-400">Dropbox</span>
                    </div>

                    <div className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-lg p-4 text-center border border-teal-500/30">
                      <div className="w-12 h-12 bg-teal-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-black font-bold text-sm">QB</span>
                      </div>
                      <span className="text-sm font-medium">QuickBooks</span>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <span className="text-sm text-gray-400">Shopify</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
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

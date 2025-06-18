"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react"

export default function FillerSections() {
  return (
    <div className="bg-black text-white">
      {/* Features Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Why Choose Finex?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your financial data into actionable insights with our AI-powered platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6 h-full">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart Analytics</h3>
                <p className="text-gray-400">
                  AI-powered insights that turn your financial data into strategic advantages.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6 h-full">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Secure & Compliant</h3>
                <p className="text-gray-400">
                  Enterprise-grade security with automatic compliance monitoring and reporting.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gray-900 border-gray-800 p-6 h-full">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real-time Processing</h3>
                <p className="text-gray-400">
                  Instant document processing and live updates to keep you ahead of the curve.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 lg:px-12 bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">Trusted by Growing Businesses</h2>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400">Active Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">$2.4B</div>
                <div className="text-gray-400">Assets Under Management</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">99.9%</div>
                <div className="text-gray-400">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400">AI Monitoring</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12">
        <div className="container mx-auto">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Financial Intelligence?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join hundreds of businesses already using Finex to make smarter financial decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 hover:bg-white/5 text-white">
                Schedule Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Placeholder Section */}
      <section className="py-24 px-6 lg:px-12 bg-gray-900/30">
        <div className="container mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">More Content Coming Soon</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This is a placeholder section. You can replace this with testimonials, detailed features, pricing, or any
              other content you need.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

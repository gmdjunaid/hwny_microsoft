"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Building2,
  FileText,
  TrendingUp,
  DollarSign,
  BarChart3,
  CheckCircle,
  X,
  Plus,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: string
  type: "single" | "monthly" | "quarterly"
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    breakEvenAnalysis: "",
    cashFlowDocs: [] as UploadedFile[],
    generalLedgerDocs: [] as UploadedFile[],
    incomeStatementDocs: [] as UploadedFile[],
  })

  const steps = [
    { title: "Company Info", icon: Building2 },
    { title: "Break-Even Analysis", icon: TrendingUp },
    { title: "Document Upload", icon: FileText },
    { title: "Review & Submit", icon: CheckCircle },
  ]

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Retail",
    "Real Estate",
    "Education",
    "Hospitality",
    "Transportation",
    "Energy",
    "Agriculture",
    "Construction",
    "Media",
    "Consulting",
    "Other",
  ]

  const handleFileUpload = (
    docType: "cashFlowDocs" | "generalLedgerDocs" | "incomeStatementDocs",
    uploadType: "single" | "monthly" | "quarterly",
  ) => {
    // Simulate file upload
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: `${docType.replace("Docs", "")}_${uploadType}_${Date.now()}.pdf`,
      size: "2.4 MB",
      type: uploadType,
    }

    setFormData((prev) => ({
      ...prev,
      [docType]: [...prev[docType], newFile],
    }))
  }

  const removeFile = (docType: "cashFlowDocs" | "generalLedgerDocs" | "incomeStatementDocs", fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      [docType]: prev[docType].filter((file) => file.id !== fileId),
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const FileUploadSection = ({
    title,
    description,
    docType,
    files,
  }: {
    title: string
    description: string
    docType: "cashFlowDocs" | "generalLedgerDocs" | "incomeStatementDocs"
    files: UploadedFile[]
  }) => (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="border-gray-600 hover:bg-white/5 text-white h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => handleFileUpload(docType, "single")}
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm">Single Document</span>
        </Button>

        <Button
          variant="outline"
          className="border-gray-600 hover:bg-white/5 text-white h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => handleFileUpload(docType, "monthly")}
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm">Monthly Files</span>
        </Button>

        <Button
          variant="outline"
          className="border-gray-600 hover:bg-white/5 text-white h-auto p-4 flex flex-col items-center gap-2"
          onClick={() => handleFileUpload(docType, "quarterly")}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm">Quarterly Files</span>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-300">Uploaded Files:</h5>
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm text-white">{file.name}</div>
                  <div className="text-xs text-gray-400">
                    {file.size} • {file.type}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(docType, file.id)}
                className="text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold">FinEx</span>
            </div>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Setup Progress: {currentStep + 1}/{steps.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center gap-2 ${index <= currentStep ? "text-white" : "text-gray-500"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < currentStep
                        ? "bg-white text-black"
                        : index === currentStep
                          ? "bg-white text-black"
                          : "bg-gray-700"
                    }`}
                  >
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${index < currentStep ? "bg-white" : "bg-gray-700"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 0: Company Info */}
              {currentStep === 0 && (
                <Card className="bg-gray-900 border-gray-800 p-8">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Tell us about your company</h2>
                      <p className="text-gray-400">We&apos;ll use this information to customize your financial dashboard.</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Company Name</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                          placeholder="Enter your company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">Industry</label>
                        <select
                          value={formData.industry}
                          onChange={(e) => setFormData((prev) => ({ ...prev, industry: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                        >
                          <option value="">Select your industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 1: Break-Even Analysis */}
              {currentStep === 1 && (
                <Card className="bg-gray-900 border-gray-800 p-8">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Break-Even Analysis</h2>
                      <p className="text-gray-400">Help us understand your business model and financial goals.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Describe your break-even analysis or key financial metrics
                      </label>
                      <textarea
                        value={formData.breakEvenAnalysis}
                        onChange={(e) => setFormData((prev) => ({ ...prev, breakEvenAnalysis: e.target.value }))}
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                        placeholder="Describe your current break-even point, monthly recurring costs, revenue targets, or any key financial metrics you track..."
                      />
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-white mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Why we need this</h4>
                          <p className="text-sm text-gray-400">
                            Understanding your break-even analysis helps our AI provide more accurate financial insights
                            and recommendations tailored to your business model.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 2 && (
                <Card className="bg-gray-900 border-gray-800 p-8">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Upload Financial Documents</h2>
                      <p className="text-gray-400">
                        Upload your financial documents to get started. You can add more later.
                      </p>
                    </div>

                    <div className="space-y-8">
                      <FileUploadSection
                        title="Cash Flow Statements"
                        description="Upload your cash flow statements to track money movement"
                        docType="cashFlowDocs"
                        files={formData.cashFlowDocs}
                      />

                      <FileUploadSection
                        title="General Ledger"
                        description="Upload your general ledger for comprehensive financial tracking"
                        docType="generalLedgerDocs"
                        files={formData.generalLedgerDocs}
                      />

                      <FileUploadSection
                        title="Income Statements"
                        description="Upload your income statements to analyze profitability"
                        docType="incomeStatementDocs"
                        files={formData.incomeStatementDocs}
                      />
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-white mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-white mb-1">Supported formats</h4>
                          <p className="text-sm text-gray-400">
                            We support PDF, Excel (.xlsx, .xls), CSV, and most common financial document formats. All
                            uploads are encrypted and secure.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <Card className="bg-gray-900 border-gray-800 p-8">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Review Your Information</h2>
                      <p className="text-gray-400">Please review your information before we create your dashboard.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Company Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Company Name:</span>
                            <span className="text-white">{formData.companyName || "Not provided"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Industry:</span>
                            <span className="text-white">{formData.industry || "Not selected"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Documents Uploaded</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cash Flow Statements:</span>
                            <span className="text-white">{formData.cashFlowDocs.length} files</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">General Ledger:</span>
                            <span className="text-white">{formData.generalLedgerDocs.length} files</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Income Statements:</span>
                            <span className="text-white">{formData.incomeStatementDocs.length} files</span>
                          </div>
                        </div>
                      </div>

                      {formData.breakEvenAnalysis && (
                        <div className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-white mb-3">Break-Even Analysis</h4>
                          <p className="text-gray-400 text-sm">{formData.breakEvenAnalysis}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-white/10 to-gray-800/50 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="w-6 h-6 text-white" />
                        <h4 className="text-lg font-semibold text-white">What happens next?</h4>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Our AI will analyze your documents (usually takes 2-5 minutes)</li>
                        <li>• We&apos;ll create your personalized financial dashboard</li>
                        <li>• You&apos;ll receive an email when your dashboard is ready</li>
                        <li>• Start exploring insights and competitor analysis immediately</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-gray-600 hover:bg-white/5 text-white disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                className="bg-white text-black hover:bg-gray-100"
                disabled={
                  (currentStep === 0 && (!formData.companyName || !formData.industry)) ||
                  (currentStep === 1 && !formData.breakEvenAnalysis)
                }
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="bg-white text-black hover:bg-gray-100"
                onClick={() => {
                  // Handle form submission and redirect to dashboard
                  console.log("Form submitted:", formData)
                  window.location.href = "/dashboard"
                }}
              >
                Create My Dashboard
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Suspense, lazy } from "react"
const Spline = lazy(() => import("@splinetool/react-spline"))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-800 border-t-white rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-mono">Loading Finex AI</span>
            </div>
          </div>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}

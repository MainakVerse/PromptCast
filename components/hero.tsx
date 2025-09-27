'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6  bg-gradient-to-br from-green-200 via-green-600 to-green-900 overflow-hidden">
      {/* Simple background blur circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-green-400/25 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div 
        className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        {/* Glassmorphic container */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
             Welcome To Promptcast
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Conversations between human and AI, turned into streams of ideas
            </p>

            <div className="pt-6">
              <Button 
                size="lg" 
                className="backdrop-blur-md bg-green-500/80 hover:bg-green-400/90 border border-white/30 text-white font-semibold px-8 py-6 rounded-2xl text-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explore Promptcasts
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
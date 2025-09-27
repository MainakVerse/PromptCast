'use client'

import { Lightbulb, RefreshCw, Compass, Sparkles, ArrowRight, Star } from "lucide-react"
import { useState } from "react"

export function Purpose() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)


  const benefits = [
    {
      icon: Lightbulb,
      title: "Fresh Perspectives",
      description: "Discover new angles on familiar topics through AI-human dialogue that challenges conventional thinking",
      gradient: "from-amber-400 to-green-500",
      shadowColor: "shadow-amber-500/30",
      glowColor: "from-amber-400/20 to-green-400/20",
      accentColor: "amber-400",
      number: "01"
    },
    {
      icon: RefreshCw,
      title: "Interactive Revisiting", 
      description: "Dive deeper into any topic with our advanced replay chatbot feature for continuous learning",
      gradient: "from-white to-teal-500",
      shadowColor: "shadow-emerald-500/30",
      glowColor: "from-white/20 to-teal-400/20",
      accentColor: "white",
      number: "02"
    },
    {
      icon: Compass,
      title: "Knowledge Exploration",
      description: "Navigate complex ideas through guided AI conversations",
      gradient: "from-green-400 to-purple-500",
      shadowColor: "shadow-green-500/30",
      glowColor: "from-green-400/20 to-purple-400/20",
      accentColor: "green-400",
      number: "03"
    },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.1)_0%,transparent_50%)]"></div>
        
        {/* Floating elements with improved animation */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-40" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce opacity-50" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-30" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Enhanced header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-800/80 to-green-700/80 backdrop-blur-xl border border-green-600/30 mb-8 shadow-2xl">
            <div className="w-2 h-2 bg-gradient-to-r from-white to-teal-400 rounded-full animate-pulse"></div>
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-green-200 font-semibold">Why Choose Promptcast</span>
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none">
            <span className="bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
              Why
            </span>
            <br />
            <span className="bg-gradient-to-r from-white via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Promptcast
            </span>
            <span className="text-white">?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed font-light">
            Experience a revolutionary way to engage with ideas, explore knowledge, and expand your thinking through intelligent conversations that evolve with you
          </p>
        </div>

        {/* Enhanced cards with staggered animation */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Number indicator */}
              <div className="absolute -top-4 -right-4 z-20">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg ${benefit.shadowColor}`}>
                  {benefit.number}
                </div>
              </div>

              {/* Enhanced card with better glassmorphism */}
              <div className={`
                relative p-12 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] 
                shadow-2xl border border-white/10 overflow-hidden
                transition-all duration-700 ease-out transform-gpu
                ${hoveredIndex === index 
                  ? 'scale-105 bg-gradient-to-br from-white/[0.15] to-white/[0.08] shadow-3xl border-white/20 -trangreen-y-2' 
                  : 'hover:scale-[1.02] hover:shadow-3xl'
                }
              `}>
                
                {/* Dynamic background glow */}
                <div className={`
                  absolute inset-0 rounded-3xl transition-all duration-700
                  bg-gradient-to-br ${benefit.glowColor}
                  ${hoveredIndex === index ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-60'}
                `} />
                
                {/* Content glow effect */}
                <div className={`
                  absolute inset-0 rounded-3xl transition-opacity duration-500
                  bg-gradient-to-t from-${benefit.accentColor}/5 to-transparent
                  ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                `} />

                {/* Enhanced icon with multiple layers */}
                <div className="relative mb-8 flex justify-center">
                  <div className={`
                    relative w-24 h-24 flex items-center justify-center rounded-3xl
                    bg-gradient-to-br ${benefit.gradient} ${benefit.shadowColor} shadow-2xl
                    transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
                    ${hoveredIndex === index ? 'shadow-3xl scale-110 rotate-6' : ''}
                  `}>
                    <benefit.icon className="h-12 w-12 text-white drop-shadow-xl relative z-10" />
                    
                    {/* Icon background ring */}
                    <div className={`
                      absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.gradient} opacity-0 blur-lg
                      transition-all duration-500
                      ${hoveredIndex === index ? 'opacity-90 scale-125' : 'group-hover:opacity-70 group-hover:scale-110'}
                    `} />
                  </div>
                </div>
                
                {/* Enhanced content */}
                <div className="relative z-10 text-center">
                  <h3 className={`
                    text-2xl lg:text-3xl font-bold mb-6 transition-all duration-300
                    ${hoveredIndex === index 
                      ? `text-${benefit.accentColor} scale-105` 
                      : 'text-white group-hover:text-green-100'
                    }
                  `}>
                    {benefit.title}
                  </h3>
                  
                  <p className="text-white leading-relaxed text-lg lg:text-xl group-hover:text-green-200 transition-colors duration-300 mb-6">
                    {benefit.description}
                  </p>

                  {/* Interactive learn more button */}
                  <div className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-full 
                    bg-white/5 border border-white/10 text-white text-sm font-medium
                    transition-all duration-300 cursor-pointer
                    ${hoveredIndex === index 
                      ? `bg-${benefit.accentColor}/10 border-${benefit.accentColor}/30 text-${benefit.accentColor}` 
                      : 'hover:bg-white/10 hover:text-white'
                    }
                  `}>
                    <span>Learn More</span>
                    <ArrowRight className={`w-3 h-3 transition-transform duration-300 ${hoveredIndex === index ? 'trangreen-x-1' : ''}`} />
                  </div>
                </div>
                
                {/* Enhanced floating particles */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    <div className={`absolute top-6 right-8 w-1 h-1 bg-${benefit.accentColor} rounded-full animate-ping opacity-80`} />
                    <div className={`absolute bottom-8 left-8 w-0.5 h-0.5 bg-${benefit.accentColor} rounded-full animate-pulse opacity-60`} />
                    <div className={`absolute top-1/2 right-12 w-1.5 h-1.5 bg-${benefit.accentColor} rounded-full animate-bounce opacity-40`} />
                    <div className={`absolute top-8 left-12 w-1 h-1 bg-white rounded-full animate-pulse opacity-30`} />
                  </div>
                )}
              </div>
              
              {/* Enhanced ground shadow */}
              <div className={`
                absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.glowColor} blur-2xl opacity-0 -z-10
                transition-all duration-700
                ${hoveredIndex === index ? 'opacity-60 scale-110' : 'group-hover:opacity-30 group-hover:scale-105'}
              `} />
            </div>
          ))}
        </div>
        
        {/* Enhanced bottom section */}
        <div className="text-center mt-24">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <Star className="w-6 h-6 text-white animate-pulse" />
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
          </div>
          <p className="text-white text-lg font-light">
            Ready to transform how you explore ideas?
          </p>
        </div>
      </div>
    </section>
  )
}
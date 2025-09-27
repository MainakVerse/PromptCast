'use client'
import { ArrowRight, Clock, MessageSquare, Star, TrendingUp, Users, Play, Bookmark } from "lucide-react"
import { useState } from "react"

export function BestCasts() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const casts = [
    {
      title: "The Nature of Creativity",
      description: "Exploring how human creativity intersects with AI capabilities, and what this means for the future of art and innovation in our rapidly evolving world.",
      duration: "45 min",
      interactions: "127",
      rating: 4.9,
      category: "Philosophy",
      trending: true,
      gradient: "from-green-400 to-green-500",
      glowColor: "from-green-400/20 to-green-400/20"
    },
    {
      title: "Consciousness and Computation", 
      description: "A deep dive into the philosophical questions surrounding consciousness, self-awareness, and the possibility of machine consciousness emerging from complex systems.",
      duration: "38 min",
      interactions: "89",
      rating: 4.8,
      category: "Science",
      trending: false,
      gradient: "from-green-400 to-cyan-500",
      glowColor: "from-green-400/20 to-cyan-400/20"
    },
    {
      title: "The Ethics of AI Decision Making",
      description: "Examining moral frameworks for AI systems and the responsibility we bear in creating ethical artificial intelligence that serves humanity's best interests.",
      duration: "52 min", 
      interactions: "156",
      rating: 4.9,
      category: "Ethics",
      trending: true,
      gradient: "from-emerald-400 to-teal-500",
      glowColor: "from-emerald-400/20 to-teal-400/20"
    },
  ]

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <Star className="h-4 w-4" />
            Most Popular
            <TrendingUp className="h-4 w-4" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Featured{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Promptcasts
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover our most engaging conversations that have sparked curiosity and deep thinking across our community
          </p>
        </div>

        {/* Enhanced cards grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {casts.map((cast, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card background glow */}
              <div className={`
                absolute inset-0 rounded-3xl opacity-0 transition-all duration-500
                bg-gradient-to-br ${cast.glowColor} blur-xl
                ${hoveredCard === index ? 'opacity-100 scale-105' : 'group-hover:opacity-60'}
              `} />
              
              {/* Main card */}
              <div className={`
                relative backdrop-blur-lg bg-white/80 border border-white/40 rounded-3xl overflow-hidden
                shadow-xl hover:shadow-2xl transition-all duration-500 h-full
                ${hoveredCard === index ? 'scale-105 -translate-y-2' : 'hover:scale-102'}
              `}>
                {/* Card header with gradient */}
                <div className={`relative p-8 pb-6 bg-gradient-to-br ${cast.gradient} overflow-hidden`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                  
                  {/* Trending badge */}
                  {cast.trending && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-white" />
                      <span className="text-xs text-white font-medium">Trending</span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm text-white font-medium">{cast.category}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white leading-tight mb-3">
                    {cast.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(cast.rating) ? 'text-yellow-300 fill-current' : 'text-white/40'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-white/90 text-sm font-medium">{cast.rating}</span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-8 pt-6">
                  <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                    {cast.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-8 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{cast.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm font-medium">{cast.interactions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">2.1k</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button className={`
                      flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold
                      bg-gradient-to-r ${cast.gradient} text-white shadow-lg hover:shadow-xl
                      transition-all duration-300 hover:scale-105 group/btn
                    `}>
                      <Play className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      <span>Listen Now</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    
                    <button className="w-14 h-14 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 group/bookmark">
                      <Bookmark className="h-5 w-5 text-slate-600 group-hover/bookmark:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Hover overlay effects */}
                {hoveredCard === index && (
                  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    {/* Floating particles */}
                    <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full animate-ping opacity-60" />
                    <div className="absolute bottom-6 left-8 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-80" />
                    <div className="absolute top-1/2 right-12 w-1.5 h-1.5 bg-white rounded-full animate-bounce opacity-40" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View all section */}
        <div className="text-center mt-16">
          <button className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <span>View All Promptcasts</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
          </button>
          
          <p className="text-slate-500 mt-4">
            Join thousands discovering new perspectives daily
          </p>
        </div>
      </div>
    </section>
  )
}
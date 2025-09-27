import { Brain, MessageSquare, Sparkles, ArrowRight } from "lucide-react"

export function About() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                New Medium
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                What is a{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  Promptcast
                </span>?
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-xl text-slate-600 leading-relaxed">
                Unlike traditional podcasts, a Promptcast is a collection of intelligent conversations between human
                curiosity and AI insight. Each session explores thought-provoking topics through dynamic dialogue,
                creating expandable streams of knowledge.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                Born from the desire to capture and share the magic of human-AI collaboration, Promptcasts represent a new
                medium for intellectual exploration and discovery.
              </p>
            </div>

            <button className="group flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Explore Promptcasts
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-3xl"></div>
            
            {/* Main card */}
            <div className="relative backdrop-blur-lg bg-white/70 border border-white/40 rounded-3xl p-10 shadow-2xl">
              {/* Human section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">Human Curiosity</h3>
                  <p className="text-slate-600">Questions, insights, perspectives</p>
                </div>
              </div>

              {/* Conversation flow */}
              <div className="flex items-center justify-center my-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <MessageSquare className="h-10 w-10 text-green-600 animate-pulse" />
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>

              {/* AI section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">AI Intelligence</h3>
                  <p className="text-slate-600">Analysis, connections, possibilities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
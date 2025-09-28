'use client'

import { MessageCircle, Play, ArrowRight, Sparkles, Brain, User, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import SignInModal from "@/components/SignInModal"

export function Replay() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  const messages = [
    {
      type: 'user',
      text: "Can you elaborate on the relationship between consciousness and AI?",
      icon: User,
      delay: 0
    },
    {
      type: 'ai',
      text: "That's a fascinating question that touches on philosophy of mind, cognitive science, and the nature of awareness itself...",
      icon: Brain,
      delay: 2000
    },
    {
      type: 'user', 
      text: "How do we define consciousness in the first place?",
      icon: User,
      delay: 4000
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentMessage((prev) => (prev + 1) % (messages.length + 1))
    }, 3000)
    return () => clearTimeout(timer)
  }, [currentMessage])

  useEffect(() => {
    if (currentMessage < messages.length) {
      setIsTyping(true)
      const typingTimer = setTimeout(() => {
        setIsTyping(false)
      }, 1500)
      return () => clearTimeout(typingTimer)
    }
  }, [currentMessage])

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                <Zap className="h-4 w-4" />
                Interactive Feature
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Continue the{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  conversation
                </span>
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-xl text-slate-600 leading-relaxed">
                Our Replay feature lets you dive deeper into any Promptcast topic. Ask follow-up questions, explore
                tangents, or challenge ideas through our interactive chatbot interface.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                Every Promptcast becomes a living conversation that you can expand and personalize, creating endless
                learning opportunities tailored to your curiosity.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-green-100 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Ask Anything</h4>
                  <p className="text-sm text-slate-600">Unlimited follow-ups</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Deep Insights</h4>
                  <p className="text-sm text-slate-600">AI-powered analysis</p>
                </div>
              </div>
            </div>

            {/* Demo button opens login modal */}
            <button
              onClick={() => setIsSignInOpen(true)}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Try Replay Demo
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
            </button>
          </div>

          {/* Chat mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-3xl blur-2xl"></div>
            <div className="relative backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-2xl border border-white/50">
              {/* Chat header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Replay Chat</h3>
                  <p className="text-slate-500 text-sm">Continue the conversation</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500 font-medium">Live</span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-6 min-h-[300px]">
                {messages.slice(0, currentMessage).map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 animate-fade-in ${
                      message.type === 'ai' ? 'justify-end' : ''
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {message.type === 'user' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[75%] p-4 rounded-2xl shadow-lg ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200' 
                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                    }`}>
                      <p className="text-slate-800 leading-relaxed">{message.text}</p>
                    </div>

                    {message.type === 'ai' && (
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {(isTyping || currentMessage >= messages.length) && (
                  <div className="flex items-center gap-4 animate-fade-in">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></div>
                        </div>
                        <span className="text-sm text-slate-600 font-medium ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <input 
                    type="text" 
                    placeholder="Ask a follow-up question..."
                    className="flex-1 bg-transparent text-slate-700 placeholder-slate-500 outline-none"
                    disabled
                  />
                  <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign in modal */}
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  )
}

'use client'

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-green-200 via-green-600 to-green-900 overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-green-400/25 rounded-full blur-3xl" />
      </div>

      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_5px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              Welcome To Promptcast
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Conversations between human and AI, turned into streams of ideas
            </p>

            <div className="pt-6 space-y-4">
              {!session ? (
                <div className="relative group">
                  <Button
                    size="lg"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    onMouseEnter={() => setButtonHovered(true)}
                    onMouseLeave={() => setButtonHovered(false)}
                    className="relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-black/20 to-black/10 hover:from-white/30 hover:to-white/20 border-2 border-white/40 hover:border-white/60 text-white font-bold px-12 py-7 rounded-2xl text-xl transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-white/20 group"
                  >
                    {/* Animated background shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {/* Button content */}
                    <div className="relative flex items-center justify-center space-x-4">
                      <div className={`flex-shrink-0 transition-all duration-300 ${buttonHovered ? 'rotate-12 scale-110' : ''}`}>
                        <svg className="h-7 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <span className="tracking-wide text-xl">Sign in with Google</span>
                      <div className={`transition-all duration-300 ${buttonHovered ? 'translate-x-1' : ''}`}>
                        <Sparkles className="h-6 w-6" />
                      </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-xl group-hover:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
                  </Button>
                  
                  {/* Floating particles around button */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute -top-2 -right-2 w-2 h-2 bg-white rounded-full transition-all duration-500 ${buttonHovered ? 'animate-pulse opacity-100' : 'opacity-0'}`} />
                    <div className={`absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-green-300 rounded-full transition-all duration-700 ${buttonHovered ? 'animate-pulse opacity-100' : 'opacity-0'}`} />
                    <div className={`absolute top-1/2 -right-4 w-1 h-1 bg-white rounded-full transition-all duration-600 ${buttonHovered ? 'animate-ping opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <Button
                    size="lg"
                    asChild
                    onMouseEnter={() => setButtonHovered(true)}
                    onMouseLeave={() => setButtonHovered(false)}
                    className="relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-400/90 hover:to-emerald-400/90 border-2 border-white/50 hover:border-white/70 text-white font-bold px-12 py-7 rounded-2xl text-xl transition-all duration-500 hover:scale-105 shadow-2xl hover:shadow-green-500/30 group"
                  >
                    <a href="/dashboard" className="relative flex items-center justify-center space-x-3">
                      {/* Animated background shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      
                      {/* Button content */}
                      <div className="relative flex items-center space-x-3">
                        <Sparkles className={`h-6 w-6 transition-all duration-300 ${buttonHovered ? 'rotate-180 scale-110' : ''}`} />
                        <span className="tracking-wide">Explore Promptcasts</span>
                        <ArrowRight className={`h-6 w-6 transition-all duration-300 ${buttonHovered ? 'translate-x-2 scale-110' : ''}`} />
                      </div>

                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/30 to-emerald-400/30 blur-xl group-hover:blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
                    </a>
                  </Button>
                  
                  {/* Success indicator particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-300 rounded-full transition-all duration-500 ${buttonHovered ? 'animate-bounce opacity-100' : 'opacity-0'}`} />
                    <div className={`absolute top-1/2 -right-4 w-2 h-2 bg-green-300 rounded-full transition-all duration-700 ${buttonHovered ? 'animate-pulse opacity-100' : 'opacity-0'}`} />
                    <div className={`absolute top-1/2 -left-4 w-2 h-2 bg-emerald-400 rounded-full transition-all duration-600 ${buttonHovered ? 'animate-ping opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              )}

              {/* Subtitle text */}
              <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                {!session 
                  ? "Join thousands of creators sharing AI conversations" 
                  : "Continue your journey into AI-powered content creation"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

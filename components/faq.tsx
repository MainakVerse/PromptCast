'use client'
import { ChevronDown, HelpCircle, Sparkles, MessageCircle, Users, Star } from "lucide-react"
import { useState } from "react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is a Promptcast?",
      answer: "A Promptcast is an intelligent conversation between a human and AI, captured and presented as an interactive, expandable dialogue. Unlike traditional podcasts, Promptcasts are textual, searchable, and allow for continued exploration through our Replay feature.",
      icon: Sparkles,
      category: "Basics",
      popular: true
    },
    {
      question: "How is it different from a podcast?",
      answer: "While podcasts are audio-only and offer passive listening experiences, Promptcasts are interactive, textual conversations that you can explore, search through, and expand upon. They're designed for active engagement rather than passive consumption.",
      icon: MessageCircle,
      category: "Comparison",
      popular: true
    },
    {
      question: "Can I suggest topics for future Promptcasts?",
      answer: "We welcome topic suggestions from our community. You can submit ideas through our contact form, and we'll consider them for future conversations. The best suggestions often come from genuine curiosity about complex topics.",
      icon: Users,
      category: "Community",
      popular: false
    },
    {
      question: "What is the Replay feature?",
      answer: "Replay allows you to continue any Promptcast conversation through an interactive chatbot. You can ask follow-up questions, explore tangents, or dive deeper into specific aspects of the original conversation.",
      icon: MessageCircle,
      category: "Features",
      popular: true
    },
    {
      question: "Are Promptcasts free to access?",
      answer: "Yes, all Promptcasts are freely available to read and explore. Some advanced features like extended Replay sessions may require a subscription in the future, but our core content will always remain accessible.",
      icon: Star,
      category: "Pricing",
      popular: false
    },
  ]

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Enhanced header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <HelpCircle className="h-4 w-4" />
            Got Questions?
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about Promptcasts and how they're revolutionizing conversations
          </p>
        </div>

        {/* Enhanced FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-300 ${
                openIndex === index ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              }`}
            >
              {/* Background glow effect */}
              <div className={`
                absolute inset-0 rounded-3xl transition-all duration-500
                ${openIndex === index 
                  ? 'bg-gradient-to-r from-green-400/10 to-emerald-400/10 blur-xl opacity-100' 
                  : 'opacity-0 group-hover:opacity-60 group-hover:bg-gradient-to-r group-hover:from-green-400/5 group-hover:to-emerald-400/5 group-hover:blur-lg'
                }
              `} />

              {/* Main FAQ card */}
              <div className={`
                relative backdrop-blur-lg bg-white/80 border rounded-3xl shadow-lg overflow-hidden
                transition-all duration-300 hover:shadow-xl
                ${openIndex === index 
                  ? 'border-green-200/60 shadow-2xl bg-white/90' 
                  : 'border-white/40 hover:border-green-100'
                }
              `}>
                
                {/* Question header */}
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-8 text-left transition-all duration-300 hover:bg-white/50"
                >
                  <div className="flex items-center gap-6">
                    {/* Icon container */}
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
                      ${openIndex === index 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 scale-110' 
                        : 'bg-gradient-to-br from-slate-400 to-slate-600 group-hover:from-green-400 group-hover:to-emerald-500'
                      }
                    `}>
                      <faq.icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Question content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-semibold transition-colors
                          ${openIndex === index 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-green-50 group-hover:text-green-600'
                          }
                        `}>
                          {faq.category}
                        </span>
                        {faq.popular && (
                          <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Popular
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`
                        text-xl font-bold transition-colors leading-tight
                        ${openIndex === index 
                          ? 'text-green-700' 
                          : 'text-slate-800 group-hover:text-slate-900'
                        }
                      `}>
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron icon */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                      ${openIndex === index 
                        ? 'bg-green-100 rotate-180' 
                        : 'bg-slate-100 group-hover:bg-green-50'
                      }
                    `}>
                      <ChevronDown className={`
                        h-5 w-5 transition-all duration-300
                        ${openIndex === index ? 'text-green-600' : 'text-slate-600 group-hover:text-green-500'}
                      `} />
                    </div>
                  </div>
                </button>

                {/* Answer content */}
                <div className={`
                  overflow-hidden transition-all duration-500 ease-out
                  ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="px-8 pb-8">
                    <div className="pl-20">
                      <div className="w-full h-px bg-gradient-to-r from-green-200 via-emerald-200 to-transparent mb-6"></div>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative elements for open state */}
                {openIndex === index && (
                  <div className="absolute top-4 right-4 overflow-hidden pointer-events-none">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom call-to-action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl border border-green-100">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            We're here to help! Reach out to our team for personalized assistance.
          </p>
          <button className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Contact Support
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
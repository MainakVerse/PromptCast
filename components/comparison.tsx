import { Check, X, Volume2, Bot, Zap, Brain } from "lucide-react"

export function Comparison() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-green-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <Zap className="h-4 w-4" />
            Evolution in Progress
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight">
            Podcast vs{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Promptcast
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Understanding the evolution from passive listening to active exploration of ideas
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Traditional Podcast */}
          <div className="group relative">
            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Traditional Podcast</h3>
                  <p className="text-slate-500 text-sm">Classic format</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { text: "Audio-only format", sub: "Limited to sound" },
                  { text: "Passive experience", sub: "Just listen along" },
                  { text: "Linear content", sub: "Fixed conversations" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100"
                  >
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-800">{item.text}</span>
                      <p className="text-sm text-slate-600 mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-800">Human conversations</span>
                    <p className="text-sm text-slate-600 mt-1">Personal touch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Promptcast */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50/70 backdrop-blur-sm border-2 border-green-200/50 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Promptcast</h3>
                  <p className="text-green-600 text-sm font-medium">Next generation</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <Check className="h-4 w-4 text-white" />,
                    text: "Interactive exploration",
                    sub: "Engage & discover",
                  },
                  {
                    icon: <Brain className="h-4 w-4 text-white" />,
                    text: "AI-powered insights",
                    sub: "Intelligent analysis",
                  },
                  {
                    icon: <Check className="h-4 w-4 text-white" />,
                    text: "Expandable conversations",
                    sub: "Endless possibilities",
                  },
                  {
                    icon: <Check className="h-4 w-4 text-white" />,
                    text: "The Future of Conversations",
                    sub: "Make separate streams of ideas",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">{item.text}</span>
                      <p className="text-sm text-slate-700 mt-1">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

            
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

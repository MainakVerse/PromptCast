'use client'
import { Mail, MessageSquare, Send, MapPin, Clock, ArrowRight, Sparkles, CheckCircle, Twitter, Github, Linkedin } from "lucide-react"
import { useState } from "react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Simulate form submission
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "hello@promptcast.ai",
      subtitle: "We respond within 24 hours",
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "from-blue-400/20 to-cyan-400/20"
    },
    {
      icon: MessageSquare, 
      title: "Join the Conversation",
      description: "Follow us for updates",
      subtitle: "New Promptcasts weekly",
      gradient: "from-green-500 to-emerald-500",
      glowColor: "from-green-400/20 to-emerald-400/20"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Kolkata, India",
      subtitle: "Remote-first company",
      gradient: "from-purple-500 to-pink-500",
      glowColor: "from-purple-400/20 to-pink-400/20"
    }
  ]

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" }
  ]

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <Sparkles className="h-4 w-4" />
            Let's Connect
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Get in{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you and explore new ideas together.
          </p>
        </div>

        <div className="grid xl:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact methods - Enhanced */}
          <div className="xl:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Multiple Ways to Reach Us
              </h3>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    className="group relative p-6 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Background glow */}
                    <div className={`
                      absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-br ${method.glowColor} blur-xl -z-10
                    `} />
                    
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg
                        bg-gradient-to-br ${method.gradient} group-hover:scale-110 transition-transform duration-300
                      `}>
                        <method.icon className="h-7 w-7 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-green-700 transition-colors">
                          {method.title}
                        </h4>
                        <p className="text-slate-600 font-medium mb-1">
                          {method.description}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {method.subtitle}
                        </p>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <h4 className="font-bold text-slate-900 mb-4">Follow Our Journey</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="group w-12 h-12 bg-white/60 backdrop-blur-sm border border-green-200 rounded-xl flex items-center justify-center hover:bg-green-100 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <social.icon className="h-5 w-5 text-slate-600 group-hover:text-green-600 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">24h</div>
                <div className="text-sm text-slate-600">Response Time</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-sm text-slate-600">Happy Users</div>
              </div>
            </div>
          </div>

          {/* Enhanced contact form */}
          <div className="xl:col-span-3">
            <div className="relative">
              {/* Background glow for form */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-3xl blur-2xl"></div>
              
              <div className="relative backdrop-blur-xl bg-white/70 border border-white/50 rounded-3xl p-8 lg:p-10 shadow-2xl">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Send us a Message</h3>
                  <p className="text-slate-600">We'll get back to you as soon as possible</p>
                </div>

                <div className="space-y-6">
                  {/* Name and Email row */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Your full name"
                        className={`
                          w-full px-4 py-4 rounded-xl border transition-all duration-300
                          bg-white/60 backdrop-blur-sm focus:bg-white/80
                          ${focusedField === 'name' 
                            ? 'border-green-300 ring-4 ring-green-100' 
                            : 'border-slate-200 hover:border-slate-300'
                          }
                          text-slate-900 placeholder-slate-500 outline-none
                        `}
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="your.email@example.com"
                        className={`
                          w-full px-4 py-4 rounded-xl border transition-all duration-300
                          bg-white/60 backdrop-blur-sm focus:bg-white/80
                          ${focusedField === 'email' 
                            ? 'border-green-300 ring-4 ring-green-100' 
                            : 'border-slate-200 hover:border-slate-300'
                          }
                          text-slate-900 placeholder-slate-500 outline-none
                        `}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="What's this about?"
                      className={`
                        w-full px-4 py-4 rounded-xl border transition-all duration-300
                        bg-white/60 backdrop-blur-sm focus:bg-white/80
                        ${focusedField === 'subject' 
                          ? 'border-green-300 ring-4 ring-green-100' 
                          : 'border-slate-200 hover:border-slate-300'
                        }
                        text-slate-900 placeholder-slate-500 outline-none
                      `}
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell us more about your question or suggestion..."
                      rows={6}
                      className={`
                        w-full px-4 py-4 rounded-xl border transition-all duration-300 resize-none
                        bg-white/60 backdrop-blur-sm focus:bg-white/80
                        ${focusedField === 'message' 
                          ? 'border-green-300 ring-4 ring-green-100' 
                          : 'border-slate-200 hover:border-slate-300'
                        }
                        text-slate-900 placeholder-slate-500 outline-none
                      `}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    className={`
                      group relative w-full py-4 px-8 rounded-xl font-semibold text-lg
                      shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden
                      ${isSubmitted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-[1.02]'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isSubmitted ? (
                        <>
                          <CheckCircle className="h-5 w-5 animate-bounce" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:scale-110 transition-transform" />
                          Send Message
                        </>
                      )}
                    </div>
                    
                    {/* Button glow effect */}
                    {!isSubmitted && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                    )}
                  </button>
                </div>

                {/* Form footer */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500 text-center">
                    By submitting this form, you agree to our{' '}
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                      privacy policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
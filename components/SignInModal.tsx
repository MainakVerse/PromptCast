"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
      onClose(); // Close modal (if signIn redirects, this will be ignored)
    } catch (error) {
      console.error("Google Sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-0 overflow-hidden shadow-2xl">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-6 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Welcome to Promptcast
              </DialogTitle>
              <p className="text-blue-100 text-sm mt-1">Join thousands of creators</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-6">
          {/* Features showcase */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span>Secure authentication with Google</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
              <span>Access Replay Demo and advanced features</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <span>Personalized experience & saved preferences</span>
            </div>
          </div>

          {/* Sign in button */}
          <div className="space-y-4">
            <Button
              className="w-full h-12 bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl group relative overflow-hidden"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="flex items-center justify-center gap-3 relative">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="font-medium">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </div>
            </Button>

            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 text-sm"
              >
                Maybe later
              </Button>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-xs text-slate-500 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const handleGoogleSignIn = () => {
    // Replace this with your actual Google sign-in logic
    console.log("Signing in with Google...");
    onClose(); // Close modal after sign-in
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <p className="text-sm text-slate-600">
            Sign in to continue accessing all features of Promptcast, including Replay Demo.
          </p>

          <Button
            variant="default"
            className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
            onClick={handleGoogleSignIn}
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </Button>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

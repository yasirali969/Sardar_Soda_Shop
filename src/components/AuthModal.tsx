import React, { useState } from "react";
import { X, Lock, Mail, UserPlus, LogIn, AlertCircle } from "lucide-react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("That email is already registered, sweetheart.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password, baby.");
      } else {
        setError(err.message || "Something went wrong, sweetie.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Card Panel */}
      <div className="relative w-full max-w-md bg-[#251520] border border-[#e0a84a]/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
        
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#e0a84a]/5 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-[10px] text-[#e0a84a] font-mono tracking-widest uppercase font-bold">
            Sardar Accounts
          </span>
          <h2 className="text-2xl font-black text-white font-mono mt-1">
            {isSignUp ? "Create Your Profile" : "Welcome Back, Sweetie"}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            {isSignUp 
              ? "Sign up to keep track of all your tasty soda pick-ups!" 
              : "Log in to view your favorite drafts and checkout instantly."}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 mb-4 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-mono tracking-widest block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-500" />
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-[#e0a84a] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 uppercase font-mono tracking-widest block mb-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-500" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-[#e0a84a] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#e0a84a] to-[#cca03a] text-[#251520] font-extrabold text-sm rounded-xl cursor-pointer hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-[#251520]/20 border-t-[#251520] animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Log In
              </>
            )}
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 text-center text-xs">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-400 hover:text-white transition-colors underline"
          >
            {isSignUp 
              ? "Already have an account? Sign in here" 
              : "Don't have an account? Create one now!"}
          </button>
        </div>

        {/* Continue as Guest */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <button
            onClick={onClose}
            className="text-xs text-[#e0a84a] font-bold tracking-wider uppercase bg-[#e0a84a]/5 border border-[#e0a84a]/20 px-5 py-2 rounded-full hover:bg-[#e0a84a]/10 transition-all"
          >
            Continue as Guest
          </button>
        </div>

      </div>
    </div>
  );
}

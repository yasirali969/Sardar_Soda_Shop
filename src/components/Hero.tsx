import { motion } from "motion/react";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

interface HeroProps {
  onAskAI: () => void;
  onExploreMenu: () => void;
}

export default function Hero({ onAskAI, onExploreMenu }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-radial from-[#3d1829] via-[#201018] to-[#12080d]"
    >
      {/* Soft light orbs in background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#e0a84a]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#e0a84a]/5 rounded-full blur-[120px]" />

      {/* Decorative Line-Art Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#e0a84a_1px,transparent_1px),linear-gradient(to_bottom,#e0a84a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">
        
        {/* Floating Tagline Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e0a84a]/10 border border-[#e0a84a]/20 text-[#e0a84a] text-xs font-bold tracking-wider uppercase mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Real Craft Sodas & Milk Sodas
        </motion.div>

        {/* Big Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-mono tracking-tight leading-none mb-6"
        >
          Your Perfect Sip, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e0a84a] via-[#f7d794] to-[#e0a84a] animate-shimmer">
            Every Single Time.
          </span>
        </motion.h1>

        {/* Tagline / Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed font-sans mb-10"
        >
          Decision fatigue ends here at <strong className="text-white font-semibold">Sardar Chill & Grill</strong>. 
          Browse our famous 25+ local craft sodas, or answer just two quick questions to let our intelligent 
          AI Drink Assistant find your matching flavor in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
        >
          <button
            onClick={onAskAI}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#e0a84a] to-[#cca03a] hover:brightness-110 active:scale-95 text-[#251520] font-extrabold text-base tracking-wide shadow-xl shadow-[#e0a84a]/10 transition-all cursor-pointer"
          >
            Ask AI Assistant
            <ArrowRight className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={onExploreMenu}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/20 hover:border-[#e0a84a] hover:bg-[#e0a84a]/5 text-white font-extrabold text-base tracking-wide transition-all cursor-pointer"
          >
            Explore Menu
          </button>
        </motion.div>

        {/* Little Bottom Highlight Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 flex items-center gap-2 text-xs text-gray-400 font-mono"
        >
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          <span>Shop is Open — Accepting Online Pre-Orders for Pickup!</span>
        </motion.div>

      </div>
    </section>
  );
}

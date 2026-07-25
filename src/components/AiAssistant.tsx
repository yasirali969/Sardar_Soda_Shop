import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, ShoppingCart, ThumbsUp, ArrowRight, CornerDownRight } from "lucide-react";
import { generateDrinkRecommendation, RecommendationResult } from "../lib/gemini";
import { MenuItem, createAiRecommendation } from "../lib/firebase";

interface AiAssistantProps {
  menu: MenuItem[];
  onAddToOrder: (drinkName: string, size: "Regular" | "Medium" | "Large", price: number) => void;
  onRefreshPopular: () => void;
}

const CRAVING_OPTIONS = [
  { value: "Fruity", label: "Fruity & Juicy", emoji: "🍓", desc: "Sweet, berry-infused, or delicious tropical juices" },
  { value: "Tangy", label: "Tangy & Zesty", emoji: "🍋", desc: "Sour lemon, tamarind, or traditional spices" },
  { value: "Creamy", label: "Creamy & Rich", emoji: "🍦", desc: "Decadent milk sodas and sweet ice-cream blends" },
  { value: "Refreshing", label: "Refreshing & Light", emoji: "🌿", desc: "Minty fresh, clean botanical, or cooling bubbles" }
];

const BUDGET_OPTIONS = [
  { value: "Regular", label: "Regular Size", emoji: "🥤", desc: "Classic satisfying size (60 - 80 PKR)" },
  { value: "Medium", label: "Medium Size", emoji: "🥤", desc: "Perfect gold-ilocks quantity (80 - 100 PKR)" },
  { value: "Large", label: "Large Size", emoji: "🍺", desc: "Ultimate big-gulper serving (100 - 120 PKR)" }
];

const LOADING_STEPS = [
  "Stirring up Sardar's secret black spices...",
  "Squeezing the fresh lime and mint...",
  "Charging the sparkling soda siphon...",
  "Perfecting the ice-to-bubble ratio...",
  "Consulting the AI mixology manual..."
];

export default function AiAssistant({ menu, onAddToOrder, onRefreshPopular }: AiAssistantProps) {
  const [step, setStep] = useState(1);
  const [craving, setCraving] = useState("");
  const [budgetTier, setBudgetTier] = useState<"Regular" | "Medium" | "Large" | "">("");
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const startLoaderCycle = () => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_STEPS.length;
      setLoadingMsgIdx(index);
    }, 1500);
    return interval;
  };

  const handleGenerate = async () => {
    if (!craving || !budgetTier) return;
    setLoading(true);
    setRecommendation(null);
    const intervalId = startLoaderCycle();

    try {
      // 1. Call client-side Gemini (or fallbacks)
      const result = await generateDrinkRecommendation(craving, budgetTier as any, menu);
      
      // 2. Automatically log to Firestore immediately (Requirement #6)
      await createAiRecommendation({
        craving,
        budgetTier: budgetTier as any,
        primaryDrink: result.primary.name,
        backupDrink: result.backup.name
      });

      // 3. Update result and advance step
      setRecommendation(result);
      setStep(3);
      onRefreshPopular(); // Trigger parent popular list reload
    } catch (err) {
      console.error("AI Generation error: ", err);
    } finally {
      clearInterval(intervalId);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCraving("");
    setBudgetTier("");
    setStep(1);
    setRecommendation(null);
  };

  return (
    <section id="ai-assistant" className="py-20 bg-[#251520] border-t border-b border-[#e0a84a]/10 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#e0a84a]/20 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0a84a]/10 text-[#e0a84a] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            AI Flavor Matcher
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono">Meet Your Perfect Sip</h2>
          <p className="mt-2 text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
            Skip the scrolling! Answer two simple questions, and our smart assistant will brew up a single confident recommendation just for you.
          </p>
        </div>

        {/* Wizard Container Card */}
        <div className="bg-[#2a1a25]/60 border border-[#e0a84a]/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e0a84a]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <span className="text-xs text-gray-400 font-mono">
              {step === 3 ? "Recommendation Ready!" : `Step ${step} of 2`}
            </span>
            <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#e0a84a] h-full transition-all duration-300"
                style={{ width: step === 1 ? "50%" : step === 2 ? "100%" : "100%" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: CRAVING */}
            {step === 1 && !loading && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-[#e0a84a] font-mono">01.</span> What are you in the mood for?
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CRAVING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setCraving(opt.value)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer group ${
                        craving === opt.value
                          ? "bg-[#e0a84a]/15 border-[#e0a84a] shadow-lg shadow-[#e0a84a]/5"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-3xl p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                        {opt.emoji}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">{opt.label}</h4>
                        <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!craving}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#e0a84a] text-[#251520] font-bold text-sm cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: BUDGET */}
            {step === 2 && !loading && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-[#e0a84a] font-mono">02.</span> What is your budget or size preference?
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {BUDGET_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBudgetTier(opt.value as any)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col gap-3 cursor-pointer group ${
                        budgetTier === opt.value
                          ? "bg-[#e0a84a]/15 border-[#e0a84a] shadow-lg shadow-[#e0a84a]/5"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-2xl p-1.5 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                          {opt.emoji}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-[#e0a84a]">Size-Fit</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">{opt.label}</h4>
                        <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-400 hover:text-white transition-all underline font-mono"
                  >
                    Back to Craving
                  </button>

                  <button
                    disabled={!budgetTier}
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#e0a84a] to-[#cca03a] text-[#251520] font-extrabold text-sm shadow-md cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Shake and Recommend!
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* LOADING SCREEN */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-[#e0a84a]/20 border-t-[#e0a84a] animate-spin" />
                  <Sparkles className="w-6 h-6 text-[#e0a84a] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <h4 className="font-mono text-xs text-[#e0a84a] uppercase tracking-widest mb-2 animate-pulse">
                  Mixing Cup...
                </h4>
                <p className="text-white font-medium text-center text-sm">
                  {LOADING_STEPS[loadingMsgIdx]}
                </p>
              </motion.div>
            )}

            {/* STEP 3: RESULTS */}
            {step === 3 && recommendation && !loading && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col"
              >
                <div className="text-center mb-8">
                  <span className="text-xs uppercase tracking-widest text-[#e0a84a] font-bold">Recommended Blend</span>
                  <h3 className="text-2xl font-black text-white mt-1">Sardar AI Chef Recommends</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  
                  {/* PRIMARY MATCH CARD */}
                  <div className="relative bg-[#321c2a] border-2 border-[#e0a84a] rounded-2xl p-5 flex flex-col justify-between shadow-xl shadow-[#e0a84a]/5">
                    <div className="absolute top-3 right-3 bg-[#e0a84a] text-[#251520] text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                      Best Match
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#e0a84a] mb-2">
                        <span>{recommendation.primary.size} Size</span>
                        <span>•</span>
                        <span>{recommendation.primary.price} PKR</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-black text-white">{recommendation.primary.name}</h4>
                      <p className="text-xs text-gray-300 mt-3 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 italic">
                        "{recommendation.primary.reason}"
                      </p>
                    </div>

                    <button
                      onClick={() => onAddToOrder(recommendation.primary.name, recommendation.primary.size, recommendation.primary.price)}
                      className="mt-5 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#e0a84a] text-[#251520] font-extrabold text-xs tracking-wider cursor-pointer hover:brightness-105 active:scale-98 transition-all shadow-md"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Order
                    </button>
                  </div>

                  {/* BACKUP MATCH CARD */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-md hover:border-white/20 transition-all">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#e0a84a] mb-2">
                        <span>{recommendation.backup.size} Size</span>
                        <span>•</span>
                        <span>{recommendation.backup.price} PKR</span>
                        <span className="text-gray-400 font-sans ml-auto italic">Alternative</span>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-white">{recommendation.backup.name}</h4>
                      <p className="text-xs text-gray-400 mt-3 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                        "{recommendation.backup.reason}"
                      </p>
                    </div>

                    <button
                      onClick={() => onAddToOrder(recommendation.backup.name, recommendation.backup.size, recommendation.backup.price)}
                      className="mt-5 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white/5 text-white font-bold text-xs tracking-wider border border-white/20 cursor-pointer hover:bg-white/10 hover:border-[#e0a84a]/40 transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add Backup Option
                    </button>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <ThumbsUp className="w-3 h-3 text-[#e0a84a]" />
                    Logged immediately inside Firestore's recommendation metrics database!
                  </p>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs text-[#e0a84a] font-bold tracking-wider uppercase border-b border-[#e0a84a] pb-0.5"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-slow" />
                    Try Another Blend
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}

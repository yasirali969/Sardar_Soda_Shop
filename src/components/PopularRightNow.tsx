import React, { useEffect, useState } from "react";
import { PopularDrink, fetchPopularDrinks, MenuItem } from "../lib/firebase";
import { Flame, ShoppingCart, TrendingUp } from "lucide-react";

interface PopularRightNowProps {
  menu: MenuItem[];
  refreshTrigger: number;
  onAddToOrder: (drinkName: string, size: "Regular" | "Medium" | "Large", price: number) => void;
}

export default function PopularRightNow({ menu, refreshTrigger, onAddToOrder }: PopularRightNowProps) {
  const [popular, setPopular] = useState<PopularDrink[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPopular = async () => {
    setLoading(true);
    try {
      const data = await fetchPopularDrinks(3);
      setPopular(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopular();
  }, [refreshTrigger]);

  const handleQuickAdd = (drinkName: string) => {
    const menuItem = menu.find(m => m.name.toLowerCase() === drinkName.toLowerCase());
    const price = menuItem ? (menuItem.priceRegular || menuItem.priceMedium) : 80;
    const size = menuItem?.priceRegular ? "Regular" : "Medium";
    onAddToOrder(drinkName, size as any, price);
  };

  return (
    <section id="popular" className="py-16 bg-[#251520] border-b border-white/5 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#e0a84a]/10 rounded-2xl text-[#e0a84a]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight flex items-center gap-2">
                Popular Right Now
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Computed live by parsing recent AI drink recommendation queries from our global customer database.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            Live Firestore Query
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 border-[#e0a84a]/20 border-t-[#e0a84a] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popular.map((item, index) => {
              // Find matching menu details to show category or price
              const details = menu.find(m => m.name.toLowerCase() === item.name.toLowerCase());
              const price = details ? (details.priceRegular || details.priceMedium) : 80;
              const size = details?.priceRegular ? "Regular" : "Medium";

              return (
                <div
                  key={item.name + index}
                  className="bg-[#2a1a25]/60 border border-[#e0a84a]/10 hover:border-[#e0a84a]/30 rounded-2xl p-5 relative overflow-hidden transition-all group flex flex-col justify-between"
                >
                  {/* Rank Circle */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#e0a84a]/10 group-hover:bg-[#e0a84a]/20 transition-all rounded-full flex items-center justify-center font-black text-white/50 text-xl font-mono pt-3 pr-3">
                    #{index + 1}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">
                      {details?.category === "milkSoda" ? "Milk Soda" : "Craft Soda"}
                    </span>
                    <h3 className="text-lg font-extrabold text-white mt-1 group-hover:text-[#e0a84a] transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {details?.description || "High request volume on current hot weather session."}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300 font-mono">
                      {price} PKR <span className="text-[9px] text-gray-500 font-normal">({size})</span>
                    </span>
                    
                    <button
                      onClick={() => handleQuickAdd(item.name)}
                      className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[#e0a84a]/10 hover:bg-[#e0a84a] text-[#e0a84a] hover:text-[#251520] font-extrabold text-[10px] tracking-wider uppercase border border-[#e0a84a]/20 cursor-pointer transition-all"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to order
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

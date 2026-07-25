import React, { useState } from "react";
import { MenuItem } from "../lib/firebase";
import { ShoppingCart, Plus, Minus, Flame } from "lucide-react";

interface FullMenuProps {
  menu: MenuItem[];
  onAddToOrder: (drinkName: string, size: "Regular" | "Medium" | "Large", price: number, quantity: number) => void;
}

export default function FullMenu({ menu, onAddToOrder }: FullMenuProps) {
  const [activeTab, setActiveTab] = useState<"soda" | "milkSoda">("soda");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, "Regular" | "Medium" | "Large">>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredItems = menu.filter((item) => item.category === activeTab);

  const handleSizeChange = (itemId: string, size: "Regular" | "Medium" | "Large") => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const handleAdd = (item: MenuItem) => {
    const itemId = item.id || item.name;
    const defaultSize = item.category === "milkSoda" ? "Medium" : "Regular";
    const size = selectedSizes[itemId] || defaultSize;
    const quantity = quantities[itemId] || 1;

    let price = item.priceMedium;
    if (size === "Regular" && item.priceRegular) {
      price = item.priceRegular;
    } else if (size === "Large") {
      price = item.priceLarge;
    }

    onAddToOrder(item.name, size, price, quantity);

    // Reset local quantity back to 1 for convenience
    setQuantities((prev) => ({ ...prev, [itemId]: 1 }));
  };

  return (
    <section id="menu" className="py-20 bg-[#201018] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e0a84a]/10 text-[#e0a84a] text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5" />
            Live Tastebook
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">Our Full Soda Menu</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Choose your size, customize the quantity, and lock in your pre-order. Every drink is prepared fresh right before your pickup time!
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab("soda")}
            className={`px-6 py-3 rounded-full text-sm font-extrabold tracking-wider uppercase border transition-all cursor-pointer ${
              activeTab === "soda"
                ? "bg-[#e0a84a] text-[#251520] border-[#e0a84a] shadow-lg shadow-[#e0a84a]/10"
                : "bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            🥤 Craft Sodas
          </button>
          
          <button
            onClick={() => setActiveTab("milkSoda")}
            className={`px-6 py-3 rounded-full text-sm font-extrabold tracking-wider uppercase border transition-all cursor-pointer ${
              activeTab === "milkSoda"
                ? "bg-[#e0a84a] text-[#251520] border-[#e0a84a] shadow-lg shadow-[#e0a84a]/10"
                : "bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            🍦 Milk Sodas
          </button>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemId = item.id || item.name;
            const defaultSize = item.category === "milkSoda" ? "Medium" : "Regular";
            const size = selectedSizes[itemId] || defaultSize;
            const quantity = quantities[itemId] || 1;

            let currentPrice = item.priceMedium;
            if (size === "Regular" && item.priceRegular) {
              currentPrice = item.priceRegular;
            } else if (size === "Large") {
              currentPrice = item.priceLarge;
            }

            return (
              <div
                key={itemId}
                className="bg-[#2a1a25]/40 border border-white/5 rounded-2xl p-5 hover:border-[#e0a84a]/20 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Title & Description */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="font-extrabold text-lg text-white leading-tight">{item.name}</h3>
                    <span className="font-mono text-base font-black text-[#e0a84a] whitespace-nowrap">
                      {currentPrice} PKR
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 leading-relaxed mb-5 h-10 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Size Selector */}
                  <div className="mb-5">
                    <span className="text-[10px] uppercase font-mono text-gray-500 tracking-wider block mb-2">
                      Select Size
                    </span>
                    <div className="flex gap-1.5 bg-black/20 p-1 rounded-xl">
                      {item.category === "soda" && item.priceRegular && (
                        <button
                          onClick={() => handleSizeChange(itemId, "Regular")}
                          className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                            size === "Regular"
                              ? "bg-[#e0a84a] text-[#251520]"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          R ({item.priceRegular})
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleSizeChange(itemId, "Medium")}
                        className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                          size === "Medium"
                            ? "bg-[#e0a84a] text-[#251520]"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        M ({item.priceMedium})
                      </button>

                      <button
                        onClick={() => handleSizeChange(itemId, "Large")}
                        className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${
                          size === "Large"
                            ? "bg-[#e0a84a] text-[#251520]"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        L ({item.priceLarge})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quantity & Add to Cart Controls */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-4">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                    <button
                      onClick={() => handleQuantityChange(itemId, -1)}
                      className="text-gray-400 hover:text-white p-0.5"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-black text-white px-1.5 font-mono">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(itemId, 1)}
                      className="text-gray-400 hover:text-white p-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add To Cart Button */}
                  <button
                    onClick={() => handleAdd(item)}
                    className="flex-grow flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#e0a84a] text-[#251520] hover:brightness-105 active:scale-98 text-xs font-black tracking-wider uppercase cursor-pointer transition-all shadow-md"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

import { MenuItem } from "../lib/firebase";
import { Sparkles, ShoppingCart, Star } from "lucide-react";

interface FeaturedDrinksProps {
  menu: MenuItem[];
  onAddToOrder: (drinkName: string, size: "Regular" | "Medium" | "Large", price: number) => void;
}

export default function FeaturedDrinks({ menu, onAddToOrder }: FeaturedDrinksProps) {
  // Get 4 signature items
  const signatureNames = ["Lemon Masala", "Mint Margrita", "Mango Juice", "Ice Cream Soda"];
  const featured = menu.filter((item) => signatureNames.includes(item.name));

  // If menu is empty or hasn't loaded yet, default to hardcoded list
  const displayItems = featured.length > 0 ? featured : [
    {
      name: "Lemon Masala",
      category: "soda",
      priceRegular: 60,
      priceMedium: 80,
      priceLarge: 100,
      description: "Classic fizzy lemonade with an authentic, tangy blend of dry roasted spices and black salt.",
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Mint Margrita",
      category: "soda",
      priceRegular: 80,
      priceMedium: 100,
      priceLarge: 120,
      description: "Refreshing crushed fresh mint leaves blended with sweet citrus juices and ice-cold soda.",
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Mango Juice",
      category: "soda",
      priceRegular: 60,
      priceMedium: 80,
      priceLarge: 100,
      description: "Pure rich mango pulp sweetened and given a heavy sparkling carbonation hit.",
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "Ice Cream Soda",
      category: "milkSoda",
      priceMedium: 100,
      priceLarge: 120,
      description: "Creamy whole milk and sweet syrup, charged with heavy soda and topped with vanilla ice cream.",
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400"
    }
  ];

  return (
    <section id="featured" className="py-20 bg-gradient-to-b from-[#201018] to-[#251520] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-semibold mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            Signature Crafts
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">Our Legendary Creations</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            These are the signature drinks that put Sardar on the map. Exquisite, fresh, and hand-brewed by our master soda chefs.
          </p>
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => {
            const minPrice = item.priceRegular || item.priceMedium;
            const sizeOption: "Regular" | "Medium" = item.priceRegular ? "Regular" : "Medium";
            
            return (
              <div
                key={item.name + idx}
                className="group relative bg-[#2a1a25]/50 border border-white/5 rounded-3xl overflow-hidden hover:border-[#e0a84a]/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="relative aspect-square overflow-hidden bg-black/10">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201018]/90 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold bg-[#e0a84a] text-[#251520] rounded-full uppercase tracking-wider">
                    {item.category === "milkSoda" ? "Milk Soda" : "Craft Soda"}
                  </span>

                  {/* Pricing Badge */}
                  <span className="absolute bottom-3 right-3 font-mono font-black text-white text-lg bg-[#251520]/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
                    {minPrice} PKR <span className="text-[10px] font-normal text-gray-300">start</span>
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-extrabold text-xl text-white tracking-tight leading-snug group-hover:text-[#e0a84a] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">
                      Quick Order
                    </span>
                    <button
                      onClick={() => onAddToOrder(item.name, sizeOption, minPrice)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#e0a84a]/10 hover:bg-[#e0a84a] text-[#e0a84a] hover:text-[#251520] font-bold text-xs tracking-wider border border-[#e0a84a]/20 transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add Medium
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

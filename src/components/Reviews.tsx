import { MessageSquare, Star, Quote } from "lucide-react";

const REVIEWS_LIST = [
  {
    name: "Kamran Shah",
    role: "Local College Student",
    review: "The Lemon Masala is legendary! Seriously, we stop by here every day after classes. Having this online pre-order makes it so much faster—I just ask the AI, order, walk in, grab it, and we are good to go!",
    stars: 5
  },
  {
    name: "Alizeh Fatima",
    role: "Food Blogger",
    review: "The Ice Cream Soda here has the perfect milk-to-fizz ratio, topped with incredibly thick, high-quality vanilla bean ice cream. I used the AI assistant, and it recommended exactly what I wanted. Super impressed!",
    stars: 5
  },
  {
    name: "Zafar Abbas",
    role: "Regular Customer",
    review: "I love bringing my family here on weekends. Mint Margrita is extremely cooling and fresh, unlike those artificial syrups elsewhere. 10/10 for taste, friendliness, and this amazing online system.",
    stars: 5
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-[#251520] border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            Customer Affection
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">Loved by the Community</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Don't just take our word for it—read these sweet reviews from our regular walk-ins and dessert lovers.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS_LIST.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#2a1a25]/50 border border-white/5 rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between hover:border-[#e0a84a]/20 transition-all duration-300 shadow-md"
            >
              <Quote className="w-8 h-8 text-[#e0a84a]/10 absolute top-6 right-6" />

              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#e0a84a] text-[#e0a84a]" />
                  ))}
                </div>

                <p className="text-sm text-gray-300 leading-relaxed italic">
                  "{rev.review}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <h4 className="font-bold text-white text-base leading-tight">{rev.name}</h4>
                <p className="text-xs text-[#e0a84a] font-mono mt-0.5">{rev.role}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

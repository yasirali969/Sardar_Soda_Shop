import { Camera, Heart, Eye } from "lucide-react";

const GALLERY_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
    title: "Signature Mint Margrita",
    likes: 248
  },
  {
    url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=400",
    title: "Tangy Imli Alu Bukhara",
    likes: 189
  },
  {
    url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400",
    title: "Double Vanilla Ice Cream Soda",
    likes: 312
  },
  {
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400",
    title: "Sweet Strawberry Bubbly",
    likes: 156
  },
  {
    url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
    title: "Fresh Lime Squeezing Counter",
    likes: 204
  },
  {
    url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=400",
    title: "Premium Spiced Siphons",
    likes: 275
  }
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-[#201018] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5" />
            Counter Snapshots
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">Sardar Counter Vibe</h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Take a sweet peek at our freshly-stirred fizzy layers, premium ingredients, and the lovely, bubbly action behind the counter.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <div
              key={idx}
              className="group relative aspect-square bg-[#2a1a25] rounded-3xl overflow-hidden border border-white/5 hover:border-[#e0a84a]/20 transition-all duration-300 shadow-md"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#201018] via-[#201018]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-xs uppercase tracking-widest text-[#e0a84a] font-mono font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Live Snapshot
                </span>
                <h4 className="text-lg font-black text-white mt-1 leading-tight">{photo.title}</h4>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 font-mono">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>{photo.likes} lovely likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

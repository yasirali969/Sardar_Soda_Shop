import { MapPin, Phone, Clock, Mail, Instagram, Facebook, ArrowUpRight } from "lucide-react";

export default function AboutContact() {
  return (
    <section id="about" className="py-20 bg-[#201018] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* About Section */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#e0a84a] font-mono font-bold">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight leading-none">
              Sardar Soda House
            </h2>
            <p className="text-serif italic text-[#e0a84a] text-lg">
              Crafting premium bubbles and sweet memories for the soul.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              Founded at our humble corner counter, Sardar Chill & Grill has grown to become the heart of craft sodas. 
              Our mission is simple: to rescue you from decision fatigue with our signature blends, premium dry-roasted 
              spices, and hand-muddled herbs. By bridging high-tech AI recommendations with traditional recipe craft, 
              we make sure you enjoy a perfect, tailored sip, every single time.
            </p>

            <div className="pt-4 flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#e0a84a] transition-colors uppercase font-mono font-bold"
              >
                <Instagram className="w-4 h-4" />
                Instagram
                <ArrowUpRight className="w-3 h-3 text-gray-600" />
              </a>
              <span className="text-gray-700">•</span>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#e0a84a] transition-colors uppercase font-mono font-bold"
              >
                <Facebook className="w-4 h-4" />
                Facebook
                <ArrowUpRight className="w-3 h-3 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="bg-[#2a1a25]/60 border border-[#e0a84a]/10 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl backdrop-blur-md">
            <h3 className="text-xl font-bold text-white font-mono border-b border-white/5 pb-3">
              Store Information & Location
            </h3>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#e0a84a]/10 rounded-xl text-[#e0a84a] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Store Location</h4>
                  <p className="text-xs text-gray-400 mt-0.5 font-sans leading-relaxed">
                    Sardar Chill & Grill, Main Highway Road, Near Iba Sukkur Airport Road, Sukkur, Pakistan.
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#e0a84a]/10 rounded-xl text-[#e0a84a] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Stirring Hours</h4>
                  <p className="text-xs text-gray-300 font-mono mt-0.5">
                    Daily: 12:00 PM - 12:00 AM
                  </p>
                  <span className="text-[10px] text-green-400 font-mono">Accepting pre-orders online</span>
                </div>
              </div>

              {/* Hotlines */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#e0a84a]/10 rounded-xl text-[#e0a84a] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Ordering Hotline</h4>
                  <p className="text-xs text-gray-300 font-mono mt-0.5">
                    +92 300 1234567
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Call for event bookings & party catering.
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#e0a84a]/10 rounded-xl text-[#e0a84a] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Catering Email</h4>
                  <p className="text-xs text-gray-300 font-mono mt-0.5">
                    hello@sardarsoda.com
                  </p>
                </div>
              </div>
            </div>

            {/* Little friendly note */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
              <p className="text-xs text-gray-400 italic font-sans leading-relaxed">
                "We muddle our mint fresh and roast our cumin daily to guarantee that beautiful authentic spiced soda spark."
              </p>
              <span className="text-[10px] text-[#e0a84a] font-serif block mt-2 font-bold">— Sardar Counter Chefs</span>
            </div>

          </div>

        </div>

        {/* Brand Copyright Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Sardar Chill & Grill. All rights reserved. Crafted with pure love.</p>
          <p className="font-mono text-[10px] uppercase tracking-wider">
            Built using <span className="text-[#e0a84a] font-bold">Firebase Firestore & Auth</span>
          </p>
        </div>

      </div>
    </section>
  );
}

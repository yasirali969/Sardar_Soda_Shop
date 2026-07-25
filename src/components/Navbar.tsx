import React, { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, LogOut, History, Flame } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../lib/firebase";

interface NavbarProps {
  user: FirebaseUser | null;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenHistory: () => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "AI Assistant", href: "#ai-assistant" },
  { label: "Popular", href: "#popular" },
  { label: "Featured", href: "#featured" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "About", href: "#about" }
];

export default function Navbar({ user, cartCount, onOpenCart, onOpenAuth, onOpenHistory }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll position to apply background styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Monitor section intersections to highlight active link
  useEffect(() => {
    const sections = NAV_ITEMS.map(item => document.querySelector(item.href));
    
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // Trigger when section occupies the mid-viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleSignOut = () => {
    auth.signOut().catch(err => console.error("Sign out error", err));
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-[#251520]/95 backdrop-blur-md shadow-lg border-b border-[#e0a84a]/10 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Tagline */}
          <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className="flex items-center gap-2 group">
            <div className="relative p-1 bg-gradient-to-tr from-[#e0a84a] to-[#f4d185] rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-6 h-6 text-[#251520] fill-[#251520]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-white font-mono">SARDAR</span>
                <span className="text-[#e0a84a] font-serif italic text-sm">Chill & Grill</span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans tracking-widest uppercase">Soda Craft House</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? "text-[#e0a84a] bg-[#e0a84a]/10 font-bold border border-[#e0a84a]/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* User Profile */}
            {user ? (
              <div className="flex items-center gap-3 bg-[#e0a84a]/5 px-3 py-1.5 rounded-full border border-[#e0a84a]/10">
                <div className="flex items-center gap-1.5 text-xs text-[#e0a84a]">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={onOpenHistory}
                  title="View Order History"
                  className="text-gray-300 hover:text-[#e0a84a] transition-colors"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-gray-300 hover:text-white border border-gray-600 hover:border-[#e0a84a] transition-all"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-gradient-to-r from-[#e0a84a] to-[#cca03a] hover:brightness-110 active:scale-95 text-[#251520] font-bold rounded-full shadow-lg transition-all flex items-center justify-center gap-1.5 px-4"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white border-2 border-[#251520] text-[10px] w-5.5 h-5.5 rounded-full flex items-center justify-center font-extrabold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Gold 'Order Now' Pill Button */}
            <button
              onClick={() => {
                const target = document.querySelector("#menu");
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#e0a84a] to-[#cca03a] text-[#251520] hover:brightness-110 active:scale-95 font-extrabold text-sm rounded-full shadow-lg hover:shadow-[#e0a84a]/25 transition-all cursor-pointer"
            >
              Order Now
            </button>
          </div>

          {/* Mobile Cart & Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Cart Icon for Mobile */}
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-[#e0a84a]/10 border border-[#e0a84a]/20 text-[#e0a84a] rounded-full"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Icon for Mobile */}
            <button
              onClick={user ? onOpenHistory : onOpenAuth}
              className="p-2 bg-white/5 text-gray-300 rounded-full hover:text-[#e0a84a]"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#251520] border-b border-[#e0a84a]/10 py-4 px-4 transition-all duration-300">
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                  activeSection === item.href.slice(1)
                    ? "text-[#e0a84a] bg-[#e0a84a]/10 font-bold border border-[#e0a84a]/20"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </a>
            ))}
            
            {user && (
              <div className="mt-3 pt-3 border-t border-[#e0a84a]/10 flex items-center justify-between px-4 text-sm">
                <span className="text-gray-400 font-mono truncate max-w-[200px]">{user.email}</span>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-400 font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

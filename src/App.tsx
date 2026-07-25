import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, fetchMenuItems, MenuItem, OrderItem } from "./lib/firebase";

// Import custom sections
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AiAssistant from "./components/AiAssistant";
import PopularRightNow from "./components/PopularRightNow";
import FeaturedDrinks from "./components/FeaturedDrinks";
import FullMenu from "./components/FullMenu";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import AboutContact from "./components/AboutContact";

// Import modals/panels
import CartModal from "./components/CartModal";
import AuthModal from "./components/AuthModal";
import OrderHistoryModal from "./components/OrderHistoryModal";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<(OrderItem & { id: string })[]>([]);
  const [refreshPopular, setRefreshPopular] = useState(0);

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Menu from Firestore (seeding happens automatically on first load)
  useEffect(() => {
    fetchMenuItems()
      .then((data) => {
        setMenu(data);
      })
      .catch((err) => {
        console.error("Error fetching menu on load", err);
      });
  }, []);

  // Add Item to Order Cart
  const handleAddToOrder = (
    drinkName: string,
    size: "Regular" | "Medium" | "Large",
    price: number,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      // Find if item of same name and size is already in cart
      const existingIdx = prev.findIndex(
        (item) => item.name.toLowerCase() === drinkName.toLowerCase() && item.size === size
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        const newItem = {
          id: `${drinkName}-${size}-${Math.random().toString(36).substring(2, 9)}`,
          name: drinkName,
          size,
          price,
          quantity
        };
        return [...prev, newItem];
      }
    });

    // Automatically slide open the cart drawer so the user sees their sweet selection!
    setIsCartOpen(true);
  };

  const handleUpdateCartItemQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAskAI = () => {
    const target = document.querySelector("#ai-assistant");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const handleExploreMenu = () => {
    const target = document.querySelector("#menu");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  const triggerRefreshPopular = () => {
    setRefreshPopular((prev) => prev + 1);
  };

  return (
    <div className="bg-[#12080d] min-h-screen text-white font-sans selection:bg-[#e0a84a]/30 selection:text-[#e0a84a]">
      {/* Navbar overlay */}
      <Navbar
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Pages Flow */}
      <main>
        <Hero onAskAI={handleAskAI} onExploreMenu={handleExploreMenu} />
        
        <AiAssistant
          menu={menu}
          onAddToOrder={handleAddToOrder}
          onRefreshPopular={triggerRefreshPopular}
        />

        <PopularRightNow
          menu={menu}
          refreshTrigger={refreshPopular}
          onAddToOrder={handleAddToOrder}
        />

        <FeaturedDrinks menu={menu} onAddToOrder={handleAddToOrder} />

        <FullMenu menu={menu} onAddToOrder={handleAddToOrder} />

        <Gallery />

        <Reviews />

        <AboutContact />
      </main>

      {/* Slide-over panels & Modals */}
      <CartModal
        user={user}
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateCartItemQty={handleUpdateCartItemQty}
        onRemoveCartItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <OrderHistoryModal
        user={user}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

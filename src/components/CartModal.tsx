import React, { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, Calendar, CheckCircle2, Copy } from "lucide-react";
import { OrderItem, createOrder } from "../lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface CartModalProps {
  user: FirebaseUser | null;
  cart: (OrderItem & { id: string })[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateCartItemQty: (itemId: string, delta: number) => void;
  onRemoveCartItem: (itemId: string) => void;
  onClearCart: () => void;
}

export default function CartModal({
  user,
  cart,
  isOpen,
  onClose,
  onUpdateCartItemQty,
  onRemoveCartItem,
  onClearCart
}: CartModalProps) {
  const [pickupTime, setPickupTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderReference, setOrderReference] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !pickupTime || !customerName) return;

    setLoading(true);
    const referenceId = "SDR-" + Math.floor(100000 + Math.random() * 900000);

    try {
      await createOrder({
        orderId: referenceId,
        createdAt: new Date().toISOString(),
        items: cart.map(({ id, ...rest }) => rest), // Remove React temporary IDs
        total,
        pickupTime: `${pickupTime} (Name: ${customerName})`,
        status: "pending",
        uid: user ? user.uid : null // Guest checkout has uid left null (Requirement #7)
      });

      setOrderReference(referenceId);
      onClearCart();
    } catch (err) {
      alert("Something went wrong placing your order, sweetie. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRef = () => {
    if (orderReference) {
      navigator.clipboard.writeText(orderReference);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#251520] h-full shadow-2xl flex flex-col justify-between border-l border-[#e0a84a]/15 z-10 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#2a1a25]/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e0a84a]" />
            <h2 className="text-xl font-bold text-white font-mono">Your Soda Cart</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderReference ? (
          /* ORDER SUCCESS SCREEN */
          <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#e0a84a]/10 rounded-full flex items-center justify-center mb-6 border border-[#e0a84a]/20">
              <CheckCircle2 className="w-8 h-8 text-[#e0a84a]" />
            </div>
            
            <span className="text-xs text-[#e0a84a] font-mono uppercase font-bold tracking-widest">Order Received!</span>
            <h3 className="text-2xl font-black text-white mt-1">Soda is on the Shake!</h3>
            
            <p className="text-sm text-gray-400 mt-3 max-w-sm">
              We have locked in your slot, sweetheart! Mention your order ID or name at the counter when you arrive.
            </p>

            <div className="my-6 p-4 bg-white/5 rounded-2xl border border-white/10 w-full flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] text-gray-500 font-mono block uppercase">Order Reference ID</span>
                <span className="text-lg font-black text-white tracking-widest font-mono">{orderReference}</span>
              </div>
              <button 
                onClick={handleCopyRef}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all"
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#e0a84a] font-mono italic">
              Estimated ready time matches your selected schedule!
            </p>

            <button
              onClick={() => {
                setOrderReference(null);
                onClose();
              }}
              className="mt-8 w-full py-3.5 bg-[#e0a84a] hover:brightness-105 text-[#251520] font-extrabold text-sm rounded-xl cursor-pointer transition-all"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          /* CART CONTENT */
          <div className="flex-grow flex flex-col justify-between">
            {cart.length === 0 ? (
              <div className="p-6 flex-grow flex flex-col items-center justify-center text-center text-gray-400">
                <div className="p-4 bg-white/5 rounded-full mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Cart is empty</h3>
                <p className="text-xs mt-1 max-w-xs">
                  Fill it up by choosing delicious craft sodas or letting the AI Mixologist pick for you!
                </p>
              </div>
            ) : (
              <div className="p-6 flex-grow overflow-y-auto max-h-[45vh]">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-[#2a1a25]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-white/10 transition-all"
                    >
                      <div className="flex-grow">
                        <span className="text-[9px] uppercase tracking-wider text-[#e0a84a] font-mono font-bold">
                          {item.size} Size
                        </span>
                        <h4 className="font-bold text-white text-sm mt-0.5 leading-snug">{item.name}</h4>
                        <span className="text-xs text-gray-400 font-mono block mt-1">{item.price} PKR / unit</span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-lg">
                          <button 
                            onClick={() => onUpdateCartItemQty(item.id, -1)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-black text-white px-1">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateCartItemQty(item.id, 1)}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemoveCartItem(item.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Check-Out / Placing Order Form */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[#2a1a25]/40 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5 font-mono">
                  <span className="text-xs text-gray-400">Total Bill Amount:</span>
                  <span className="text-xl font-black text-[#e0a84a]">{total} PKR</span>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-3 mt-4">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-mono tracking-widest block mb-1">
                      Your Pickup Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Yasir Ali"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-[#e0a84a] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-mono tracking-widest block mb-1">
                      Choose Pickup Time *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#e0a84a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#e0a84a] to-[#cca03a] hover:brightness-105 text-[#251520] font-extrabold text-sm rounded-xl cursor-pointer transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#251520]/20 border-t-[#251520] animate-spin" />
                    ) : (
                      "Place Pre-Order Now"
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-500 font-mono mt-1">
                    No payment needed online! Pay in cash/card on pickup.
                  </p>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

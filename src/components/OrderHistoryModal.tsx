import React, { useEffect, useState } from "react";
import { X, History, ShoppingBag, Clock, CheckCircle, HelpCircle } from "lucide-react";
import { Order, fetchUserOrders } from "../lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

interface OrderHistoryModalProps {
  user: FirebaseUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderHistoryModal({ user, isOpen, onClose }: OrderHistoryModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      fetchUserOrders(user.uid)
        .then((data) => {
          setOrders(data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

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
            <History className="w-5 h-5 text-[#e0a84a]" />
            <h2 className="text-xl font-bold text-white font-mono">Order History</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow p-6 overflow-y-auto max-h-[85vh]">
          {!user ? (
            <div className="flex flex-col items-center justify-center text-center h-full text-gray-400">
              <ShoppingBag className="w-10 h-10 mb-3 text-gray-500" />
              <h3 className="text-white font-bold">Please Sign In</h3>
              <p className="text-xs mt-1 max-w-xs">
                Log in to synchronize, save, and browse your full order history!
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-[#e0a84a]/20 border-t-[#e0a84a] animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
              <ShoppingBag className="w-10 h-10 mb-3 text-gray-500" />
              <h3 className="text-white font-bold">No orders found</h3>
              <p className="text-xs mt-1 max-w-xs">
                You haven't placed any pre-orders on this account yet. Try placing one now, sweetie!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-[#2a1a25]/50 border border-white/5 hover:border-[#e0a84a]/10 rounded-2xl p-5 transition-all"
                >
                  {/* Title Bar */}
                  <div className="flex justify-between items-start gap-4 pb-3 border-b border-white/5">
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">Order ID</span>
                      <span className="text-sm font-black text-white font-mono tracking-widest">{order.orderId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">Status</span>
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#e0a84a] px-2 py-0.5 bg-[#e0a84a]/10 rounded-full font-mono">
                        <Clock className="w-3 h-3" />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="py-3 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-gray-300">
                          {item.quantity}x {item.name} <span className="text-[10px] text-gray-500">({item.size})</span>
                        </span>
                        <span className="text-gray-400 font-mono">{item.price * item.quantity} PKR</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details */}
                  <div className="pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[9px] text-gray-500 font-mono uppercase block">Pickup Details</span>
                      <span className="text-gray-300 font-medium">{order.pickupTime}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 font-mono uppercase block">Total Bill</span>
                      <span className="text-sm font-black text-[#e0a84a] font-mono">{order.total} PKR</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-[#2a1a25]/40 text-center">
          <p className="text-[10px] text-gray-500 font-mono">
            Thank you for choosing Sardar Chill & Grill. Sweetest sips, sweetheart!
          </p>
        </div>

      </div>
    </div>
  );
}

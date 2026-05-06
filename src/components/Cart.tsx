import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Trash2, Plus, Minus, Check } from 'lucide-react';
import { CartItem } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClear: () => void;
}

export default function Cart({ isOpen, onClose, items, onRemove, onUpdateQuantity, onClear }: CartProps) {
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', location: '', instructions: '' });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsOrdering(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerLocation: customerInfo.location,
        specialInstructions: customerInfo.instructions,
        items,
        total,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      onClear();
      setTimeout(() => {
        setIsSuccess(false);
        setIsCheckingOut(false);
        onClose();
        setCustomerInfo({ name: '', phone: '', location: '', instructions: '' });
      }, 3000);
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setIsOrdering(false);
    }
  };

  const handleClose = () => {
    setIsCheckingOut(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-earth-bg z-[70] overflow-hidden flex flex-col rounded-sm shadow-2xl border border-earth-clay/10"
          >
            <div className="p-6 sm:p-8 border-b border-earth-clay/10 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-3">
                {isCheckingOut ? (
                  <button onClick={() => setIsCheckingOut(false)} className="mr-2 p-2 hover:bg-earth-clay/5 rounded-full text-earth-clay transition-all">
                    <ArrowRight className="rotate-180" size={20} />
                  </button>
                ) : (
                  <ShoppingBag className="text-earth-clay" size={24} />
                )}
                <h2 className="text-xl sm:text-2xl font-serif text-earth-ink tracking-tight uppercase">
                  {isCheckingOut ? 'Finalize Order' : 'Your Basket'}
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 text-earth-ink/40 hover:text-earth-clay transition-colors rounded-full hover:bg-earth-clay/5">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
                    <Check size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-earth-ink mb-2">Order Received!</h3>
                    <p className="text-earth-ink/60 text-sm">We're preparing your delicious meal. Our team will contact you shortly.</p>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20">
                  <div className="w-16 h-16 bg-earth-info/5 rounded-full flex items-center justify-center text-earth-clay/30">
                    <ShoppingBag size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif text-earth-ink">Your basket is resting...</h3>
                    <p className="text-earth-ink/40 text-sm font-light">Explore our menu to add some flavor.</p>
                  </div>
                  <button 
                    onClick={handleClose}
                    className="border-b border-earth-clay text-earth-clay text-[10px] uppercase font-black tracking-widest pb-1 hover:text-earth-ink hover:border-earth-ink transition-all"
                  >
                    Discover our delicacies
                  </button>
                </div>
              ) : isCheckingOut ? (
                <div className="space-y-8">
                  <div className="bg-earth-cream p-6 rounded-sm border border-earth-clay/5">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] uppercase tracking-widest text-earth-clay font-black">Order Summary</h4>
                      <span className="text-[10px] text-earth-ink/40 font-bold">{items.length} Items</span>
                    </div>
                    <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                          <span className="text-earth-ink/70">{item.quantity}× {item.name}</span>
                          <span className="text-earth-ink font-bold">{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-earth-clay/10 flex justify-between items-baseline">
                      <span className="text-[10px] uppercase tracking-widest text-earth-ink/40 font-black">Total to pay</span>
                      <span className="text-2xl font-serif text-earth-clay">{total.toLocaleString()} <span className="text-[8px] font-sans">FCFA</span></span>
                    </div>
                  </div>

                  <form id="order-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                    <div className="space-y-2.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black ml-1">Full Name *</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border border-earth-clay/10 focus:border-earth-clay outline-none px-4 py-3.5 text-earth-ink text-sm rounded-sm transition-all shadow-sm"
                        placeholder="e.g. Ama Danjouma"
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black ml-1">Phone Number *</label>
                      <input
                        required
                        type="tel"
                        className="w-full bg-white border border-earth-clay/10 focus:border-earth-clay outline-none px-4 py-3.5 text-earth-ink text-sm rounded-sm transition-all shadow-sm"
                        placeholder="+237 6XX XXX XXX"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2.5 sm:col-span-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black ml-1">Delivery Location *</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border border-earth-clay/10 focus:border-earth-clay outline-none px-4 py-3.5 text-earth-ink text-sm rounded-sm transition-all shadow-sm"
                        placeholder="Street, Quarter, or nearby Landmark"
                        value={customerInfo.location}
                        onChange={e => setCustomerInfo({...customerInfo, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2.5 sm:col-span-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black ml-1">Food Description / Special Notes</label>
                      <textarea
                        className="w-full bg-white border border-earth-clay/10 focus:border-earth-clay outline-none px-4 py-3.5 text-earth-ink text-sm rounded-sm transition-all resize-none shadow-sm"
                        placeholder="E.g. Extra spicy, no onions, or preference for well-done meat..."
                        rows={3}
                        value={customerInfo.instructions}
                        onChange={e => setCustomerInfo({...customerInfo, instructions: e.target.value})}
                      />
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 sm:gap-6 group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-earth-cream border border-earth-clay/5 rounded-sm overflow-hidden shadow-sm">
                        {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt={item.name} />}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-earth-ink font-bold text-base leading-tight truncate">{item.name}</h4>
                          <button onClick={() => onRemove(item.id!)} className="text-earth-ink/20 hover:text-red-500 transition-all p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <button 
                              onClick={() => onUpdateQuantity(item.id!, -1)}
                              className="w-8 h-8 rounded-full border border-earth-clay/10 flex items-center justify-center text-earth-ink/40 hover:bg-earth-clay hover:border-earth-clay hover:text-white transition-all shadow-sm"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-earth-ink font-black text-sm min-w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id!, 1)}
                              className="w-8 h-8 rounded-full border border-earth-clay/10 flex items-center justify-center text-earth-ink/40 hover:bg-earth-clay hover:border-earth-clay hover:text-white transition-all shadow-sm"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-earth-clay font-black text-sm">{(item.price).toLocaleString()} <span className="text-[10px] opacity-40">FCFA</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && !isSuccess && (
              <div className="p-6 sm:p-8 bg-white/50 border-t border-earth-clay/10 space-y-6">
                {!isCheckingOut ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-baseline px-1">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Subtotal</span>
                      <span className="text-3xl font-serif text-earth-clay">{total.toLocaleString()} <span className="text-[10px] font-sans font-black uppercase text-earth-ink/30">FCFA</span></span>
                    </div>
                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full bg-earth-ink text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-xl hover:bg-earth-clay active:scale-[0.98]"
                    >
                      Process Checkout
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      form="order-form"
                      type="submit"
                      disabled={isOrdering}
                      className="w-full bg-earth-clay hover:bg-earth-clay/90 disabled:bg-earth-ink/10 text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-earth-clay/20 active:scale-[0.98]"
                    >
                      {isOrdering ? 'Confirming with Kitchen...' : 'Seal Order & Deliver'}
                      {!isOrdering && <Check size={16} />}
                    </button>
                    <p className="text-[9px] text-center text-earth-ink/30 uppercase tracking-[0.2em] font-black">
                      Delivery available within the Island limits
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

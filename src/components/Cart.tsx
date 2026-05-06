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
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', location: '' });

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
        setCustomerInfo({ name: '', phone: '', location: '' });
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-earth-bg shadow-2xl z-[70] flex flex-col border-l border-earth-clay/10"
          >
            <div className="p-8 border-b border-earth-clay/10 flex items-center justify-between bg-earth-bg">
              <div className="flex items-center gap-3">
                {isCheckingOut ? (
                  <button onClick={() => setIsCheckingOut(false)} className="mr-2 text-earth-clay">
                    <ArrowRight className="rotate-180" size={20} />
                  </button>
                ) : (
                  <ShoppingBag className="text-earth-clay" size={24} />
                )}
                <h2 className="text-2xl font-serif text-earth-ink tracking-tight uppercase">
                  {isCheckingOut ? 'Checkout' : 'Your Order'}
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 text-earth-ink/40 hover:text-earth-clay transition-colors rounded-full hover:bg-earth-clay/5">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-earth-sage/10 flex items-center justify-center text-earth-sage">
                    <Check size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif text-earth-ink mb-2">Order Confirmed!</h3>
                    <p className="text-earth-ink/60 font-light leading-relaxed">Chef is already getting the ingredients ready. Thank you for choosing Food Island Lounge.</p>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-earth-ink/20">
                  <ShoppingBag size={64} strokeWidth={0.5} />
                  <p className="font-serif italic text-xl">Your basket is waiting...</p>
                  <button onClick={onClose} className="text-earth-clay text-[10px] uppercase tracking-[0.2em] font-black hover:scale-105 transition-transform mt-4">
                    Discover our delicacies
                  </button>
                </div>
              ) : isCheckingOut ? (
                <div className="space-y-8">
                  <div className="bg-earth-cream p-6 rounded-sm border border-earth-clay/5">
                    <h4 className="text-[10px] uppercase tracking-widest text-earth-clay font-black mb-4">Summary</h4>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-earth-ink/60">{item.quantity}x {item.name}</span>
                          <span className="text-earth-ink font-bold">{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-earth-clay/10 flex justify-between font-serif text-lg">
                        <span>Total</span>
                        <span className="text-earth-clay">{total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>

                  <form id="order-form" onSubmit={handlePlaceOrder} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Full Name</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border border-earth-clay/10 focus:border-earth-clay outline-none px-5 py-4 text-earth-ink text-sm rounded-sm transition-all"
                        placeholder="John Doe"
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Phone Number</label>
                      <input
                        required
                        type="tel"
                        className="w-full bg-white border border-earth-clay/10 focus:border-earth-clay outline-none px-5 py-4 text-earth-ink text-sm rounded-sm transition-all"
                        placeholder="+237 6XX XXX XXX"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Delivery Location</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border border-earth-clay/10 focus:border-earth-clay outline-none px-5 py-4 text-earth-ink text-sm rounded-sm transition-all"
                        placeholder="Street, District, or Landmark"
                        value={customerInfo.location}
                        onChange={e => setCustomerInfo({...customerInfo, location: e.target.value})}
                      />
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-5 group">
                      <div className="w-24 h-24 shrink-0 bg-earth-cream border border-earth-clay/5 rounded-sm overflow-hidden shadow-sm">
                        {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" alt={item.name} />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-earth-ink font-bold text-base leading-tight">{item.name}</h4>
                          <button onClick={() => onRemove(item.id!)} className="text-earth-ink/20 hover:text-earth-clay transition-colors p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-earth-clay font-bold text-sm mb-4">{item.price.toLocaleString()} FCFA</p>
                        <div className="flex items-center gap-4 pt-3">
                          <button 
                            onClick={() => onUpdateQuantity(item.id!, -1)}
                            className="w-8 h-8 rounded-full border border-earth-clay/10 flex items-center justify-center text-earth-ink/40 hover:bg-earth-clay hover:border-earth-clay hover:text-white transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-earth-ink font-bold text-sm min-w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id!, 1)}
                            className="w-8 h-8 rounded-full border border-earth-clay/10 flex items-center justify-center text-earth-ink/40 hover:bg-earth-clay hover:border-earth-clay hover:text-white transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && !isSuccess && (
              <div className="p-8 bg-earth-cream border-t border-earth-clay/10 space-y-6">
                {!isCheckingOut ? (
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-earth-clay hover:bg-earth-clay/90 text-white py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-earth-clay/20 active:scale-[0.98]"
                  >
                    Place an Order
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <div className="space-y-4">
                    <button
                      form="order-form"
                      type="submit"
                      disabled={isOrdering}
                      className="w-full bg-earth-clay hover:bg-earth-clay/90 disabled:bg-earth-ink/10 text-white py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-earth-clay/20 active:scale-[0.98]"
                    >
                      {isOrdering ? 'Preparing Order...' : 'Confirm Delivery'}
                      {!isOrdering && <Check size={16} />}
                    </button>
                    <p className="text-[10px] text-center text-earth-ink/30 uppercase tracking-widest font-black">
                      Secured by Food Island Lounge
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

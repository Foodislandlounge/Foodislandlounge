import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
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
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsOrdering(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        items,
        total,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      onClear();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setCustomerInfo({ name: '', email: '' });
      }, 3000);
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-amber-500" size={24} />
                <h2 className="text-xl font-serif text-white">Your Order</h2>
              </div>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Order Placed!</h3>
                  <p className="text-gray-400 font-light">Chef is already getting the ingredients ready. Thank you for choosing Food Island Lounge.</p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-600">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif italic text-lg">Your card is empty.</p>
                  <button onClick={onClose} className="text-amber-500 text-xs uppercase tracking-widest font-bold hover:underline underline-offset-4">
                    Explore our delicacies
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 shrink-0 bg-zinc-900 border border-white/5">
                      {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={item.name} />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <button onClick={() => onRemove(item.id!)} className="text-zinc-600 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-zinc-500 text-xs font-mono">{item.price.toLocaleString()} FCFA</p>
                      <div className="flex items-center gap-3 pt-2">
                        <button 
                          onClick={() => onUpdateQuantity(item.id!, -1)}
                          className="w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-amber-500 hover:text-amber-500 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-white text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id!, 1)}
                          className="w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-amber-500 hover:text-amber-500 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && !isSuccess && (
              <div className="p-8 bg-zinc-900/50 border-t border-white/5 space-y-6">
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Your Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-black/40 border border-zinc-800 focus:border-amber-500/50 outline-none px-4 py-3 text-white text-sm"
                      placeholder="Gourmet Lover"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-black/40 border border-zinc-800 focus:border-amber-500/50 outline-none px-4 py-3 text-white text-sm"
                      placeholder="your@email.com"
                      value={customerInfo.email}
                      onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-baseline">
                    <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Subtotal</span>
                    <span className="text-2xl font-serif text-white">{total.toLocaleString()} <span className="text-sm font-sans tracking-normal opacity-50">FCFA</span></span>
                  </div>

                  <button
                    disabled={isOrdering}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 text-white py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 group/btn"
                  >
                    {isOrdering ? 'Preparing Order...' : 'Confirm Order'}
                    {!isOrdering && <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

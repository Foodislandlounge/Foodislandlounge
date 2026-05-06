import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Check, Loader2, Send, MapPin } from 'lucide-react';
import MapComponent from './MapComponent';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: 2,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name || !formData.email || !formData.date || !formData.time) {
        throw new Error("Please fill in all required fields.");
      }

      await addDoc(collection(db, 'reservations'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setIsSuccess(true);
      setFormData({ name: '', email: '', date: '', time: '', guests: 2, message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-500 font-sans uppercase tracking-[0.2em] text-xs font-semibold mb-6 block">
              Reservation
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 tracking-tight">
              Reserve Your <span className="italic font-light">Table</span>
            </h2>
            <p className="text-gray-400 font-light text-lg leading-relaxed mb-12">
              Join us for an unforgettable evening. Whether it's a romantic dinner, a business lunch, or a celebration with friends, we ensure a perfect setting.
            </p>

            <div className="space-y-8 mb-12">
              <div className="border-l-2 border-amber-500/30 pl-6">
                <h4 className="text-white font-medium mb-1">Corporate Events</h4>
                <p className="text-gray-500 text-sm font-light">For parties larger than 12, please call us directly for a customized experience.</p>
              </div>
              <div className="border-l-2 border-amber-500/30 pl-6">
                <h4 className="text-white font-medium mb-1">Dietary Preferences</h4>
                <p className="text-gray-500 text-sm font-light">Inform us of any allergies or preferences in the message section below.</p>
              </div>
            </div>

            <MapComponent />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black/40 backdrop-blur-xl border border-white/5 p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500/50 outline-none p-4 text-white font-light transition-all rounded-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500/50 outline-none p-4 text-white font-light transition-all rounded-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500/50 outline-none p-4 text-white font-light transition-all rounded-none [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500/50 outline-none p-4 text-white font-light transition-all rounded-none [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Guests *</label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500/50 outline-none p-4 text-white font-light transition-all rounded-none appearance-none"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Persons</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Special Requests</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-amber-500/50 outline-none p-4 text-white font-light transition-all rounded-none resize-none"
                  placeholder="Any allergies or special occasions?"
                />
              </div>

              {error && <p className="text-red-500 text-xs tracking-wide">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 text-white py-5 rounded-none font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check size={16} />
                    Reservation Sent
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Confirm Reservation
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

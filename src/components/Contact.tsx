import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Check, Loader2, Send, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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
      if (!formData.name || !formData.phone || !formData.date || !formData.time) {
        throw new Error("Please fill in all required fields.");
      }

      await addDoc(collection(db, 'reservations'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setIsSuccess(true);
      setFormData({ name: '', phone: '', date: '', time: '', guests: 2, message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-earth-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-earth-clay font-sans uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">
              Reservation
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-earth-ink mb-10 tracking-tight leading-tight">
              Reserve Your <span className="italic font-light text-earth-clay">Table</span>
            </h2>
            <p className="text-earth-ink/70 font-light text-lg leading-relaxed mb-12 max-w-lg">
              Join us for an unforgettable evening. Whether it's a romantic dinner, a business lunch, or a celebration with friends, we ensure a perfect setting.
            </p>

            <div className="space-y-10 mb-12">
              <div className="border-l-2 border-earth-clay/20 pl-8">
                <h4 className="text-earth-ink font-bold text-sm uppercase tracking-widest mb-2">Corporate Events</h4>
                <p className="text-earth-ink/50 text-sm font-light leading-relaxed">For parties larger than 12, please call our hospitality team directly for a customized island experience.</p>
              </div>
              <div className="border-l-2 border-earth-clay/20 pl-8">
                <h4 className="text-earth-ink font-bold text-sm uppercase tracking-widest mb-2">Dietary Preferences</h4>
                <p className="text-earth-ink/50 text-sm font-light leading-relaxed">Inform us of any allergies or preferences in the message section below. Our chefs are happy to accommodate.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-earth-clay/5 p-8 md:p-12 shadow-2xl rounded-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-earth-bg/50 border border-earth-clay/10 focus:border-earth-clay focus:bg-white outline-none p-5 text-earth-ink font-light transition-all rounded-sm placeholder:text-earth-ink/20"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-earth-bg/50 border border-earth-clay/10 focus:border-earth-clay focus:bg-white outline-none p-5 text-earth-ink font-light transition-all rounded-sm placeholder:text-earth-ink/20"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-earth-bg/50 border border-earth-clay/10 focus:border-earth-clay focus:bg-white outline-none p-5 text-earth-ink font-light transition-all rounded-sm [color-scheme:light]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-earth-bg/50 border border-earth-clay/10 focus:border-earth-clay focus:bg-white outline-none p-5 text-earth-ink font-light transition-all rounded-sm [color-scheme:light]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Guests *</label>
                  <div className="relative">
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                      className="w-full bg-earth-bg/50 border border-earth-clay/10 focus:border-earth-clay focus:bg-white outline-none p-5 text-earth-ink font-light transition-all rounded-sm appearance-none cursor-pointer"
                    >
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Persons</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Special Requests</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-earth-bg/50 border border-earth-clay/10 focus:border-earth-clay focus:bg-white outline-none p-5 text-earth-ink font-light transition-all rounded-sm resize-none placeholder:text-earth-ink/20"
                  placeholder="Any allergies or special occasions?"
                />
              </div>

              {error && <p className="text-red-600 text-xs tracking-wide font-bold">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-earth-clay hover:bg-earth-clay/90 disabled:bg-earth-ink/10 text-white py-5 rounded-sm font-bold uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-earth-clay/20"
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

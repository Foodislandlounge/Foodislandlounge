import React from 'react';
import { motion } from 'motion/react';
import { IMAGES } from '../constants';

export default function Gallery() {
  const images = IMAGES.gallery || [];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-sans uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">
            Visual Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
            The <span className="italic text-amber-100 font-light">Lounge</span> Experience
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative overflow-hidden group ${
                idx === 1 || idx === 6 ? 'md:row-span-2' : ''
              }`}
            >
              <img 
                src={img} 
                alt={`Food Island Lounge ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] uppercase tracking-[0.3em] font-medium border border-white/30 px-4 py-2 backdrop-blur-sm">
                  View Detail
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { IMAGES } from '../constants';

export default function Gallery() {
  const images = IMAGES.gallery || [];

  return (
    <section className="py-24 bg-earth-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-earth-clay font-sans uppercase tracking-[0.3em] text-[10px] font-black mb-4 block">
            Visual Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-earth-ink tracking-tight">
            The <span className="italic text-earth-clay font-light font-cormorant">Lounge</span> Experience
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`relative overflow-hidden grow rounded-sm shadow-xl group border border-earth-clay/5 ${
                idx === 1 || idx === 6 ? 'md:row-span-2' : ''
              }`}
            >
              <img 
                src={img} 
                alt={`Food Island Lounge ${idx + 1}`} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-earth-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] uppercase tracking-[0.4em] font-black border border-white/20 px-5 py-3 backdrop-blur-md">
                  Island View
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

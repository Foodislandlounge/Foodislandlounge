import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { MenuItem, Category } from '../types';
import { CATEGORIES } from '../constants';
import MenuCard from './MenuCard';
import { Loader2, X } from 'lucide-react';

interface MenuProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'menu'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const menuData: MenuItem[] = [];
      snapshot.forEach((doc) => {
        menuData.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setItems(menuData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching menu:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categoriesData = [
    {
      id: 'Food' as Category,
      title: 'Island Food',
      description: 'Our traditional family recipes passed down through generations.',
      image: 'https://i.ibb.co/Z6FjN2ND/Full-Size-Render.jpg'
    },
    {
      id: 'Drinks' as Category,
      title: 'Island Drinks',
      description: 'Tropical infusions and refreshing island staples.',
      image: 'https://i.ibb.co/v6TfBfS2/Full-Size-Render.jpg'
    }
  ];

  return (
    <section id="menu" className="py-24 bg-earth-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-earth-clay font-sans uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block"
          >
            Savor the Moment
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-earth-ink tracking-tight"
          >
            Our Culinary <span className="italic font-light text-earth-clay">Offerings</span>
          </motion.h2>
          <div className="w-16 h-1 bg-earth-clay/20 mx-auto mt-6"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-earth-ink/40 gap-4">
            <Loader2 className="animate-spin text-earth-clay" size={32} />
            <p className="font-serif italic text-lg">Harvesting our finest selections...</p>
          </div>
        ) : (
          <div className="space-y-32">
            {categoriesData.map((cat, idx) => (
              <div key={cat.id} className="space-y-16">
                <div className="flex flex-col items-center gap-10">
                  <div className="text-center space-y-4 max-w-2xl px-4">
                    <h3 className="text-3xl md:text-5xl font-serif text-earth-ink tracking-wide">{cat.title}</h3>
                    <p className="text-earth-ink/60 font-light text-lg leading-relaxed">{cat.description}</p>
                    <div className="w-12 h-0.5 bg-earth-clay mx-auto"></div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full max-w-5xl mx-auto relative group cursor-zoom-in overflow-hidden rounded-sm"
                    onClick={() => setSelectedImage(cat.image)}
                  >
                    <img 
                      src={cat.image} 
                      alt={cat.title}
                      className="w-full h-auto border border-earth-clay/10 shadow-xl transition-transform duration-1000 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-earth-ink/0 group-hover:bg-earth-ink/5 transition-colors duration-500 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-earth-bg/90 backdrop-blur-sm text-earth-clay px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase border border-earth-clay/20 transition-all transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                        View Full Menu
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {items.filter(item => item.category === cat.id).map((item) => (
                    <MenuCard 
                      key={item.id} 
                      item={item} 
                      onAddToCart={onAddToCart} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-earth-ink/95 p-4 md:p-12 cursor-zoom-out backdrop-blur-sm"
            >
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage}
                alt="Full Menu"
                className="max-w-full max-h-full object-contain shadow-2xl border border-white/10"
              />
              <button 
                className="absolute top-8 right-8 text-white hover:text-earth-clay transition-colors bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20"
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              >
                <X size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

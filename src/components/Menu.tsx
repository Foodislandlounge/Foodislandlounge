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
    <section id="menu" className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-amber-500 font-sans uppercase tracking-[0.2em] text-xs font-semibold mb-4 block"
          >
            Savor the Moment
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-white tracking-tight"
          >
            Our Culinary <span className="italic font-light text-amber-50">Offerings</span>
          </motion.h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
            <Loader2 className="animate-spin" size={32} />
            <p className="font-serif italic">Loading our finest selections...</p>
          </div>
        ) : (
          <div className="space-y-32">
            {categoriesData.map((cat, idx) => (
              <div key={cat.id} className="space-y-12">
                <div className="flex flex-col items-center gap-8">
                  <div className="text-center space-y-4 max-w-2xl">
                    <h3 className="text-3xl md:text-5xl font-serif text-white tracking-wide">{cat.title}</h3>
                    <p className="text-zinc-500 font-light text-lg">{cat.description}</p>
                    <div className="w-12 h-0.5 bg-amber-600 mx-auto"></div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full max-w-4xl mx-auto relative group cursor-zoom-in"
                    onClick={() => setSelectedImage(cat.image)}
                  >
                    <img 
                      src={cat.image} 
                      alt={cat.title}
                      className="w-full h-auto border border-white/10 shadow-2xl rounded-sm transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-light border border-white/20 transition-opacity">
                        Click to expand menu
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                alt="Full Menu"
                className="max-w-full max-h-full object-contain"
              />
              <button 
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              >
                <X size={32} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

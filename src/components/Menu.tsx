import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { MenuItem, Category } from '../types';
import { CATEGORIES } from '../constants';
import MenuCard from './MenuCard';
import { Loader2 } from 'lucide-react';

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

  const categoriesData = [
    {
      id: 'Food' as Category,
      title: 'Island Food',
      description: 'Authentic flavors from the heart of the island.',
      image: 'https://i.ibb.co/Z6FjN2ND/Full-Size-Render.jpg'
    },
    {
      id: 'Drinks' as Category,
      title: 'Island Drinks',
      description: 'Refreshing tropical cocktails and house specials.',
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
                <div className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 bg-white/5 p-8 border border-white/5`}>
                  <div className="w-full md:w-1/2 aspect-video overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                    <h3 className="text-3xl md:text-5xl font-serif text-white tracking-wide">{cat.title}</h3>
                    <p className="text-zinc-500 font-light text-lg">{cat.description}</p>
                    <div className="w-12 h-0.5 bg-amber-600 mx-auto md:mx-0"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.filter(item => item.category === cat.id).map((item) => (
                    <MenuCard 
                      key={item.id} 
                      item={item} 
                      onAddToCart={onAddToCart} 
                    />
                  ))}
                  {items.filter(item => item.category === cat.id).length === 0 && (
                    <div className="col-span-full text-center py-12 text-zinc-600 font-serif italic border border-white/5">
                      New {cat.id.toLowerCase()} items coming soon...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

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
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

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

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

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
            Culinary <span className="italic font-light text-amber-50">Masterpieces</span>
          </motion.h2>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['All', ...CATEGORIES].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-6 py-2 text-[11px] uppercase tracking-widest transition-all duration-300 border ${
                selectedCategory === category 
                ? 'bg-amber-600 border-amber-600 text-white' 
                : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
            <Loader2 className="animate-spin" size={32} />
            <p className="font-serif italic">Loading our finest selections...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <MenuCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={onAddToCart} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-serif lowercase italic">
            Chef is currently preparing new inspiration... checked back soon.
          </div>
        )}
      </div>
    </section>
  );
}

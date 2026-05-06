import { motion } from 'motion/react';
import { Plus, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuCardProps {
  key?: string;
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative bg-[#0a0a0a] border border-white/5 hover:border-amber-500/30 transition-all duration-500 p-4"
    >
      <div className="aspect-square mb-6 overflow-hidden relative">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-serif lowercase italic">
            No Image
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white text-xs uppercase tracking-widest font-bold border border-white/20 px-4 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-serif text-white group-hover:text-amber-100 transition-colors">
          {item.name}
        </h3>
        <span className="text-amber-500 font-mono text-sm">
          {item.price.toLocaleString()} <span className="text-[10px]">FCFA</span>
        </span>
      </div>

      <p className="text-gray-500 text-xs font-light leading-relaxed mb-6 line-clamp-2 h-8">
        {item.description || "The soul of the island in every bite."}
      </p>

      <button
        onClick={() => onAddToCart(item)}
        disabled={!item.isAvailable}
        className="w-full py-3 border border-zinc-800 hover:border-amber-600 hover:bg-amber-600/10 text-zinc-400 hover:text-amber-400 transition-all duration-300 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 group/btn disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={12} className="group-hover/btn:-translate-y-0.5 transition-transform" />
        Add to Order
      </button>
    </motion.div>
  );
}

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
      className="group relative bg-earth-cream border border-earth-clay/5 hover:border-earth-clay/20 transition-all duration-500 p-5 rounded-sm shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      <div className="aspect-[4/5] mb-6 overflow-hidden relative rounded-sm">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            loading="lazy"
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-earth-bg flex items-center justify-center text-earth-ink/30 font-serif lowercase italic">
            Chef's Creation
          </div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-earth-ink/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-white text-[10px] uppercase tracking-[0.2em] font-bold border border-white/20 px-5 py-2">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-serif text-earth-ink group-hover:text-earth-clay transition-colors leading-tight">
          {item.name}
        </h3>
        <div className="flex flex-col items-end">
          <span className="text-earth-clay font-bold text-base">
            {item.price.toLocaleString()}
          </span>
          <span className="text-[9px] text-earth-ink/50 uppercase tracking-tighter font-bold">FCFA</span>
        </div>
      </div>

      <p className="text-earth-ink/60 text-xs font-light leading-relaxed mb-8 line-clamp-2 h-8">
        {item.description || "A taste of the island's richest heritage."}
      </p>

      <button
        onClick={() => onAddToCart(item)}
        disabled={!item.isAvailable}
        className="w-full py-4 border border-earth-clay/20 bg-transparent hover:bg-earth-clay text-earth-ink/80 hover:text-white transition-all duration-500 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 group/btn disabled:opacity-20 disabled:cursor-not-allowed rounded-sm"
      >
        <ShoppingBag size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
        Add to Order
      </button>
    </motion.div>
  );
}

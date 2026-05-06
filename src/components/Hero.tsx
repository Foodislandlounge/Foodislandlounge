import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { IMAGES } from '../constants';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with Professional Color/Gradient */}
      <div className="absolute inset-0 z-0 bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.9))]" />
        
        {/* Subtle texture/grain can be added here if desired, but keeping it "professional color" as requested */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-amber-500 font-sans uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-4 block">
            Welcome to Food Island Lounge
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tighter leading-tight mb-8">
            A Fusion of <br />
            <span className="italic text-amber-100 font-light underline decoration-amber-500/30 decoration-4 underline-offset-8">Exquisite</span> Taste
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Discover a unique culinary escape in the heart of Yaounde. Where premium flavors meet a refined lounge atmosphere.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-none font-medium tracking-widest text-xs uppercase transition-all hover:scale-105 active:scale-95"
            >
              Explore Menu
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-white/30 hover:border-white text-white px-8 py-4 rounded-none font-medium tracking-widest text-xs uppercase transition-all backdrop-blur-sm"
            >
              Book a Table
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating chevron */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}

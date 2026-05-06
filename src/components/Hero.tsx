import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { IMAGES } from '../constants';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-earth-ink">
      {/* Background Image with Professional Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.ibb.co/PG0Dxv0q/Full-Size-Render.jpg" 
          alt="Food Island Lounge Hero"
          className="w-full h-full object-cover grayscale-[0.2] brightness-[0.4] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-earth-ink/80 via-transparent to-earth-ink/90" />
        <div className="absolute inset-0 bg-earth-ink/30" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-earth-clay font-sans uppercase tracking-[0.5em] text-[10px] md:text-xs font-black mb-8 block drop-shadow-sm">
            Elegance in Every Flavor
          </span>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-earth-clay tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl">
            Food Island <br />
            <span className="italic font-light">Lounge</span>
          </h1>
          <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-wide drop-shadow-md">
            A sanctuary of taste in the heart of the city. Experience the perfect harmony of refined tradition and modern culinary art.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-earth-clay hover:bg-earth-clay/90 text-white px-10 py-5 rounded-sm font-bold tracking-widest text-[10px] uppercase transition-all shadow-lg shadow-earth-clay/20 active:scale-95"
            >
              Explore Menu
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto border border-earth-clay/30 hover:border-earth-clay text-earth-clay px-10 py-5 rounded-sm font-bold tracking-widest text-[10px] uppercase transition-all hover:bg-earth-clay/5"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-earth-clay/40"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}

import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { IMAGES } from '../constants';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-earth-bg">
      {/* Background with Professional Color/Gradient */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(188,74,60,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(250,247,242,0.8))]" />
        
        {/* Subtle texture/grain */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-earth-clay font-sans uppercase tracking-[0.4em] text-[10px] md:text-sm font-bold mb-6 block">
            Welcome to Food Island Lounge
          </span>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif text-earth-ink tracking-tight leading-[0.9] mb-8">
            The Essence of <br />
            <span className="italic text-earth-clay font-light font-cormorant">Island Living</span>
          </h1>
          <p className="text-earth-ink/70 text-base md:text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Experience an authentic culinary journey through the heart of Yaounde. Where tradition meets refined taste in a vibrant nature-inspired setting.
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

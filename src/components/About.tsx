import { motion } from 'motion/react';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';
import { IMAGES, RESTAURANT_INFO } from '../constants';

export default function About() {
  return (
    <section id="about" className="py-24 bg-earth-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-[4/5] overflow-hidden border border-earth-clay/10 group rounded-sm shadow-2xl">
              <img 
                src={IMAGES.about} 
                alt="Food Island Lounge Atmosphere" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            {/* Design accents */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-[12px] border-earth-cream hidden md:block -z-10" />
            <div className="absolute top-1/2 -left-12 -translate-y-1/2 vertical-text text-[10px] tracking-[0.6em] text-earth-clay/40 uppercase font-bold whitespace-nowrap hidden lg:block">
              ESTABLISHED IN YAOUNDÉ
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <span className="text-earth-clay font-sans uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">
              Our Story
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-earth-ink mb-10 leading-[1.1]">
              A Sanctuary for <span className="italic text-earth-clay font-light font-cormorant">Culinary Souls</span>
            </h2>
            <div className="space-y-8 text-earth-ink/70 font-light leading-relaxed text-lg">
              <p>
                Food Island Lounge was born from a vision to redefine the rhythmic essence of dining in Yaoundé. 
                Nestled opposite Neptune Tamtam, we offer more than just a meal; 
                we provide a refined sanctuary where architecture and appetite meet.
              </p>
              <p>
                Our philosophy is simple: celebrate the vibrant heritage of African ingredients through the lens of modern global techniques.
                Every dish is a testament to our commitment to freshness, flavor, and the warmth of island hospitality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-16">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-earth-cream rounded-full text-earth-clay shadow-sm">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-earth-ink font-bold text-sm uppercase tracking-wider mb-2">Location</h4>
                  <p className="text-earth-ink/60 text-sm font-light leading-snug">
                    {RESTAURANT_INFO.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="p-4 bg-earth-cream rounded-full text-earth-clay shadow-sm">
                  <Clock size={22} />
                </div>
                <div>
                  <h4 className="text-earth-ink font-bold text-sm uppercase tracking-wider mb-2">Hours</h4>
                  <p className="text-earth-ink/60 text-sm font-light leading-snug">
                    {RESTAURANT_INFO.hours}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

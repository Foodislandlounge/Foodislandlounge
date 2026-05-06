import { motion } from 'motion/react';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';
import { IMAGES, RESTAURANT_INFO } from '../constants';

export default function About() {
  return (
    <section id="about" className="py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden border border-white/10 group">
              <img 
                src={IMAGES.about} 
                alt="Food Island Lounge Atmosphere" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {/* Design accents */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-amber-500/30 hidden md:block" />
            <div className="absolute top-1/2 -left-8 -translate-y-1/2 vertical-text text-[10px] tracking-[0.5em] text-amber-500/50 uppercase whitespace-nowrap hidden lg:block">
              ESTABLISHED IN YAOUNDÉ
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-amber-500 font-sans uppercase tracking-[0.2em] text-xs font-semibold mb-6 block">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
              A Private Sanctuary for <span className="italic text-amber-100">Gourmet Lovers</span>
            </h2>
            <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
              <p>
                Food Island Lounge was born from a passion to redefine the dining experience in Yaounde. 
                Located strategically opposite Neptune Tamtam, we offer more than just a meal; 
                we provide a refined atmosphere where every detail is crafted for your comfort.
              </p>
              <p>
                Our mission is to fuse international culinary techniques with local freshness, 
                creating a menu that surprises and delights the palate of every guest who walks through our doors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 text-amber-500">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Our Location</h4>
                  <p className="text-gray-500 text-sm font-light leading-snug">
                    {RESTAURANT_INFO.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 text-amber-500">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Opening Hours</h4>
                  <p className="text-gray-500 text-sm font-light leading-snug">
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

import { IMAGES, RESTAURANT_INFO } from '../constants';

export default function Footer() {
  return (
    <footer className="bg-black py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
               <span className="text-2xl font-serif font-bold tracking-tighter text-white block">
                FOOD ISLAND <span className="text-amber-500 font-sans italic tracking-normal">Lounge</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              A private sanctuary for gourmet lovers in the heart of Yaounde. Excellence in every flavor, elegance in every moment.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-amber-500 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Menu', 'About Us', 'Contact'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} className="text-gray-400 hover:text-white transition-colors text-sm font-light">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-amber-500 mb-6">Contact</h4>
            <ul className="space-y-4 text-sm font-light text-gray-400">
              <li>{RESTAURANT_INFO.location}</li>
              <li>{RESTAURANT_INFO.phone}</li>
              <li>{RESTAURANT_INFO.email}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-amber-500 mb-6">Hours</h4>
            <p className="text-sm font-light text-gray-400 leading-relaxed italic font-serif">
              {RESTAURANT_INFO.hours}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} Food Island Lounge. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold text-zinc-600">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

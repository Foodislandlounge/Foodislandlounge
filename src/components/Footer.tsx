import { IMAGES, RESTAURANT_INFO } from '../constants';

export default function Footer() {
  return (
    <footer className="bg-earth-cream py-24 border-t border-earth-clay/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
               <span className="text-2xl font-serif font-bold tracking-tighter text-earth-ink block uppercase">
                FOOD ISLAND <span className="text-earth-clay font-sans italic tracking-normal">Lounge</span>
              </span>
            </div>
            <p className="text-earth-ink/50 text-sm font-light leading-relaxed">
              A nature-infused sanctuary for gourmet lovers in the heart of Yaoundé. Excellence in every flavor, organic harmony in every moment.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-earth-clay mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Menu', 'About Us', 'Contact'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '')}`} className="text-earth-ink/50 hover:text-earth-clay transition-colors text-sm font-medium tracking-wide">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-earth-clay mb-8">Contact</h4>
            <ul className="space-y-4 text-sm font-light text-earth-ink/50">
              <li className="leading-relaxed">{RESTAURANT_INFO.location}</li>
              <li className="font-bold text-earth-ink/70">{RESTAURANT_INFO.phone}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-earth-clay mb-8">Hours</h4>
            <p className="text-sm font-light text-earth-ink/50 leading-relaxed italic font-serif">
              {RESTAURANT_INFO.hours}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-earth-clay/5 gap-6">
          <p className="text-earth-ink/30 text-[9px] uppercase tracking-[0.2em] font-black">
            © {new Date().getFullYear()} Food Island Lounge. Build by Harry, Tyra, Emmanuel, Walters and Leonard
          </p>
          <div className="flex gap-10 text-[9px] uppercase tracking-[0.2em] font-black text-earth-ink/30">
            <span>CITEC Software Level 1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

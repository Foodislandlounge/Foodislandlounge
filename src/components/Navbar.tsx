import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
}

export default function Navbar({ cartCount, onCartClick, onAdminClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    // Check if logo exists/loads
    const img = new Image();
    img.src = IMAGES.logo;
    img.onload = () => setLogoLoaded(true);
    img.onerror = () => setLogoLoaded(false);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'menu', 'about', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.substring(1));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }} className="flex items-center gap-2 group">
          {logoLoaded ? (
            <img 
              src={IMAGES.logo} 
              alt="Food Island Lounge" 
              className="h-12 w-auto object-contain brightness-0 invert group-hover:scale-110 transition-transform duration-300" 
            />
          ) : (
            <span className="text-2xl font-serif font-bold tracking-tighter text-white group-hover:text-amber-400 transition-colors">
              FOOD ISLAND <span className="text-amber-500 font-sans italic tracking-normal">Lounge</span>
            </span>
          )}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
              className={cn(
                'text-sm uppercase tracking-widest font-medium transition-all hover:text-amber-400',
                activeSection === link.href.substring(1) ? 'text-amber-500' : 'text-gray-300'
              )}
            >
              {link.name}
              {activeSection === link.href.substring(1) && (
                <motion.div
                  layoutId="activeNav"
                  className="h-0.5 bg-amber-500 mt-1"
                />
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCartClick}
            className="p-2 text-gray-300 hover:text-amber-400 transition-colors relative"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onAdminClick}
            className="p-2 text-gray-300 hover:text-amber-400 transition-colors md:flex hidden"
          >
            <User size={20} />
          </button>
          <button
            className="md:hidden p-2 text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-zinc-900 border-b border-white/10 p-6 md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className={cn(
                  'text-lg font-medium tracking-wide transition-colors',
                  activeSection === link.href.substring(1) ? 'text-amber-500' : 'text-gray-300'
                )}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }}
              className="text-lg font-medium text-gray-300 flex items-center gap-2"
            >
              <User size={18} /> Staff Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

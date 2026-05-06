/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import AdminPanel from './components/Admin/AdminPanel';
import { CartItem, MenuItem } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync cart with local storage (optional, but good for UX)
  useEffect(() => {
    const saved = localStorage.getItem('fil-cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Cart hydration failed");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fil-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => setCartItems([]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-earth-bg text-earth-ink selection:bg-earth-clay/20 selection:text-earth-clay">
        <Navbar 
          cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)} 
          onCartClick={() => setIsCartOpen(true)}
          onAdminClick={() => setIsAdminOpen(true)}
        />
        
        <main>
          <Hero />
          <Menu onAddToCart={addToCart} onOpenCart={() => setIsCartOpen(true)} />
          <Gallery />
          <About />
          <Contact />
        </main>

        <Footer />

        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClear={clearCart}
        />

        <AdminPanel 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
        />
      </div>
    </BrowserRouter>
  );
}

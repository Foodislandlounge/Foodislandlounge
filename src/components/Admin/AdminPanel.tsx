import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, Plus, Trash2, Edit, ChevronLeft, LayoutGrid, ClipboardList, Calendar, ShoppingBag, Key, Loader2 } from 'lucide-react';
import { signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import MenuManager from './MenuManager';
import ReservationManager from './ReservationManager';
import OrderManager from './OrderManager';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PASSCODE = "654493005";

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations' | 'orders'>('menu');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const authStatus = sessionStorage.getItem('fil-admin-auth');
      if (user && authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      // We skip Firebase Auth since signInAnonymously is restricted in this project
      // Security is handled via the adminPasscode field in every write operation
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem('fil-admin-auth', 'true');
      sessionStorage.setItem('fil-admin-passcode', passcode);
    } else {
      setError("Incorrect passcode. Access denied.");
      setPasscode("");
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fil-admin-auth');
    sessionStorage.removeItem('fil-admin-passcode');
    await signOut(auth);
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-earth-ink/80 backdrop-blur-md">
        <Loader2 className="animate-spin text-earth-clay" size={40} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-earth-ink/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-earth-bg border border-earth-clay/10 shadow-2xl flex flex-col overflow-hidden rounded-sm"
      >
        <div className="p-6 border-b border-earth-clay/10 flex items-center justify-between bg-earth-cream">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-earth-clay/5 rounded-full text-earth-ink/40 hover:text-earth-clay transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-serif text-earth-ink uppercase tracking-widest font-bold">
              Staff <span className="text-earth-clay italic lowercase tracking-normal px-1">Gateway</span>
            </h2>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-earth-ink/30 font-black hidden sm:block">Admin Access</span>
              <button 
                onClick={handleLogout}
                className="text-[10px] uppercase tracking-widest text-earth-clay hover:text-earth-clay/80 font-black"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-earth-bg">
            <div className="w-20 h-20 bg-earth-clay/10 rounded-full flex items-center justify-center text-earth-clay mb-8">
              <Key size={40} />
            </div>
            <div className="max-w-xs mb-10">
              <h3 className="text-3xl font-serif text-earth-ink mb-3">Management Restricted</h3>
              <p className="text-earth-ink/50 text-sm font-light leading-relaxed">Please enter the administrative passcode to access the management panel.</p>
            </div>
            
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-6">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="•••••••••"
                className="w-full bg-white border border-earth-clay/10 px-5 py-4 text-earth-ink text-center tracking-[0.8em] focus:outline-none focus:border-earth-clay focus:ring-4 focus:ring-earth-clay/5 transition-all text-lg rounded-sm"
                autoFocus
              />
              {error && <p className="text-red-600 text-[10px] uppercase tracking-widest font-black">{error}</p>}
              <button
                type="submit"
                className="w-full bg-earth-clay text-white py-5 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-earth-clay/90 shadow-lg shadow-earth-clay/20 active:scale-[0.98]"
              >
                Authenticate
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Rail */}
            <div className="w-16 sm:w-20 border-r border-earth-clay/10 flex flex-col items-center py-8 gap-8 bg-earth-cream">
              <button
                onClick={() => setActiveTab('menu')}
                className={`p-4 rounded-full transition-all ${activeTab === 'menu' ? 'bg-earth-clay text-white shadow-xl shadow-earth-clay/20' : 'text-earth-ink/30 hover:text-earth-clay hover:bg-earth-clay/5'}`}
                title="Menu Management"
              >
                <LayoutGrid size={24} />
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`p-4 rounded-full transition-all ${activeTab === 'orders' ? 'bg-earth-clay text-white shadow-xl shadow-earth-clay/20' : 'text-earth-ink/30 hover:text-earth-clay hover:bg-earth-clay/5'}`}
                title="Order Management"
              >
                <ShoppingBag size={24} />
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`p-4 rounded-full transition-all ${activeTab === 'reservations' ? 'bg-earth-clay text-white shadow-xl shadow-earth-clay/20' : 'text-earth-ink/30 hover:text-earth-clay hover:bg-earth-clay/5'}`}
                title="Reservations"
              >
                <Calendar size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-earth-bg">
              {activeTab === 'menu' ? <MenuManager /> : activeTab === 'orders' ? <OrderManager /> : <ReservationManager />}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

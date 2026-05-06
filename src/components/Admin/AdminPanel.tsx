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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <Loader2 className="animate-spin text-amber-500" size={40} />
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
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-zinc-950 border border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-serif text-white uppercase tracking-widest">
              Staff <span className="text-amber-500 italic lowercase tracking-normal px-1">Gateway</span>
            </h2>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold hidden sm:block">Admin Access</span>
              <button 
                onClick={handleLogout}
                className="text-[10px] uppercase tracking-widest text-amber-500 hover:text-amber-400 font-bold"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6">
              <Key size={40} />
            </div>
            <div className="max-w-xs mb-8">
              <h3 className="text-2xl font-serif text-white mb-2">Management Restricted</h3>
              <p className="text-zinc-500 text-sm font-light">Please enter the administrative passcode to access the management panel.</p>
            </div>
            
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Access Code"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-center tracking-[0.5em] focus:outline-none focus:border-amber-500/50"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs uppercase tracking-widest font-bold">{error}</p>}
              <button
                type="submit"
                className="w-full bg-white text-black py-4 rounded-none font-bold uppercase tracking-widest text-xs transition-all hover:bg-amber-400"
              >
                Authenticate
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Rail */}
            <div className="w-16 sm:w-20 border-r border-white/5 flex flex-col items-center py-6 gap-6">
              <button
                onClick={() => setActiveTab('menu')}
                className={`p-3 rounded-none transition-all ${activeTab === 'menu' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Menu Management"
              >
                <LayoutGrid size={24} />
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`p-3 rounded-none transition-all ${activeTab === 'orders' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Order Management"
              >
                <ShoppingBag size={24} />
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`p-3 rounded-none transition-all ${activeTab === 'reservations' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Reservations"
              >
                <Calendar size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'menu' ? <MenuManager /> : activeTab === 'orders' ? <OrderManager /> : <ReservationManager />}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

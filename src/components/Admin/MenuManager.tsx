import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { MenuItem, Category } from '../../types';
import { CATEGORIES } from '../../constants';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon } from 'lucide-react';

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'Food' as Category,
    description: '',
    imageUrl: '',
    isAvailable: true
  });

  useEffect(() => {
    const q = query(collection(db, 'menu'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: MenuItem[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as MenuItem));
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passcode = sessionStorage.getItem('fil-admin-passcode');
    const dataWithAuth = { ...formData, adminPasscode: passcode };
    
    try {
      if (editingId) {
        await updateDoc(doc(db, 'menu', editingId), dataWithAuth);
      } else {
        await addDoc(collection(db, 'menu'), dataWithAuth);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', price: 0, category: 'Food', description: '', imageUrl: '', isAvailable: true });
    } catch (err) {
      console.error("Save failed:", err);
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        operationType: editingId ? 'update' : 'create',
        path: editingId ? `menu/${editingId}` : 'menu',
        auth: auth.currentUser ? { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous } : null
      };
      throw new Error(JSON.stringify(errInfo));
    }
  };

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable
    });
    setEditingId(item.id!);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this item?")) {
      try {
        await deleteDoc(doc(db, 'menu', id));
      } catch (err) {
        console.error("Delete failed:", err);
        const errInfo = {
          error: err instanceof Error ? err.message : String(err),
          operationType: 'delete',
          path: `menu/${id}`,
          auth: auth.currentUser ? { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous } : null
        };
        throw new Error(JSON.stringify(errInfo));
      }
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-earth-clay" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end border-b border-earth-clay/10 pb-8">
        <div>
          <h3 className="text-3xl font-serif text-earth-ink tracking-tight uppercase">Menu Inventory</h3>
          <p className="text-earth-ink/40 text-[10px] uppercase tracking-widest mt-2 font-black">Manage your culinary offerings</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="bg-earth-clay hover:bg-earth-clay/90 text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-black flex items-center gap-3 shadow-lg shadow-earth-clay/20 transition-all active:scale-[0.98] rounded-sm"
        >
          <Plus size={18} /> New Creation
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-earth-cream border border-earth-clay/5 p-10 space-y-8 rounded-sm shadow-xl">
          <h4 className="text-earth-ink font-serif text-2xl">{editingId ? 'Refine Delight' : 'Born from the Island'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Item Name</label>
              <input 
                required
                className="w-full bg-white border border-earth-clay/10 p-4 text-earth-ink text-sm focus:border-earth-clay outline-none rounded-sm transition-all shadow-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Price (FCFA)</label>
              <input 
                type="number"
                required
                className="w-full bg-white border border-earth-clay/10 p-4 text-earth-ink text-sm focus:border-earth-clay outline-none rounded-sm transition-all shadow-sm"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Category</label>
              <select 
                className="w-full bg-white border border-earth-clay/10 p-4 text-earth-ink text-sm focus:border-earth-clay outline-none rounded-sm transition-all shadow-sm appearance-none cursor-pointer"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Image Link</label>
              <input 
                className="w-full bg-white border border-earth-clay/10 p-4 text-earth-ink text-sm focus:border-earth-clay outline-none rounded-sm transition-all shadow-sm"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://images.unsplash..."
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Gastronomic Description</label>
            <textarea 
              rows={3}
              className="w-full bg-white border border-earth-clay/10 p-4 text-earth-ink text-sm focus:border-earth-clay outline-none resize-none rounded-sm transition-all shadow-sm"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-3 group">
            <input 
              type="checkbox" 
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
              className="w-5 h-5 rounded-sm accent-earth-clay cursor-pointer transition-all"
            />
            <label htmlFor="isAvailable" className="text-earth-ink/60 text-xs font-bold uppercase tracking-widest cursor-pointer group-hover:text-earth-clay transition-colors">Currently Available for Guests</label>
          </div>
          <div className="flex gap-6 pt-6 border-t border-earth-clay/10">
            <button type="submit" className="flex-1 bg-earth-ink text-white py-5 uppercase tracking-[0.2em] text-[10px] font-black rounded-sm shadow-xl hover:bg-earth-ink/90 transition-all active:scale-[0.98]">
              {editingId ? 'Seal Changes' : 'Welcome to the Menu'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-12 border border-earth-clay/20 text-earth-ink/40 hover:text-earth-ink hover:bg-earth-clay/5 uppercase tracking-[0.2em] text-[10px] font-black transition-all rounded-sm">
              Dismiss
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white border border-earth-clay/5 p-5 flex gap-6 rounded-sm shadow-sm hover:shadow-md transition-all group">
            <div className="w-24 h-24 bg-earth-bg border border-earth-clay/5 overflow-hidden shrink-0 rounded-sm shadow-inner group-hover:shadow-none transition-all">
              {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" /> : <ImageIcon className="w-full h-full p-6 text-earth-ink/10" />}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <h5 className="text-earth-ink font-bold text-base truncate leading-tight">{item.name}</h5>
                <p className="text-earth-clay text-[10px] uppercase tracking-[0.2em] font-black mt-1">
                  {item.category} • {item.price.toLocaleString()} <span className="opacity-50">FCFA</span>
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-4">
                  <button onClick={() => handleEdit(item)} className="text-earth-ink/20 hover:text-earth-clay transition-colors p-1" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id!)} className="text-earth-ink/20 hover:text-red-500 transition-colors p-1" title="Remove">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className={`text-[8px] uppercase tracking-[0.2em] font-black px-3 py-1 border rounded-full ${item.isAvailable ? 'border-green-500/20 text-green-600 bg-green-500/5' : 'border-red-500/20 text-red-600 bg-red-500/5'}`}>
                  {item.isAvailable ? 'Serving' : 'Resting'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-zinc-600" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-serif text-white tracking-wide">Menu Inventory</h3>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 uppercase tracking-widest text-[10px] font-bold flex items-center gap-2"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 p-8 space-y-6">
          <h4 className="text-white font-serif text-lg">{editingId ? 'Refine Item' : 'New Creation'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Item Name</label>
              <input 
                required
                className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:border-amber-500/50 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Price (FCFA)</label>
              <input 
                type="number"
                required
                className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:border-amber-500/50 outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Category</label>
              <select 
                className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:border-amber-500/50 outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Image URL</label>
              <input 
                className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:border-amber-500/50 outline-none"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Description</label>
            <textarea 
              rows={3}
              className="w-full bg-black border border-zinc-800 p-3 text-white text-sm focus:border-amber-500/50 outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
              className="accent-amber-600"
            />
            <label htmlFor="isAvailable" className="text-zinc-400 text-xs">Currently Available to Order</label>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-3 uppercase tracking-widest text-[10px] font-bold">
              {editingId ? 'Save Changes' : 'Add to Menu'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-8 border border-zinc-700 text-zinc-500 hover:text-white uppercase tracking-widest text-[10px] font-bold">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-white/5 p-4 flex gap-4">
            <div className="w-16 h-16 bg-black border border-white/5 overflow-hidden shrink-0">
              {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover grayscale" /> : <ImageIcon className="w-full h-full p-4 text-zinc-700" />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-white font-medium text-sm truncate">{item.name}</h5>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider">{item.category} • {item.price.toLocaleString()} FCFA</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEdit(item)} className="text-amber-500 hover:text-amber-400 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(item.id!)} className="text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
                <div className={`ml-auto text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 border ${item.isAvailable ? 'border-green-500/20 text-green-500' : 'border-red-500/20 text-red-500'}`}>
                  {item.isAvailable ? 'In Stock' : 'Out'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

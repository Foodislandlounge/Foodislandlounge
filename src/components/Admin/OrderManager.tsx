import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Order } from '../../types';
import { ShoppingBag, User, Mail, Clock, CheckCircle2, Package, XCircle, Loader2 } from 'lucide-react';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Order[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
      setLoading(false);
    }, (err) => {
      console.error("Order snapshot failed:", err);
      const errInfo = {
        error: err.message,
        operationType: 'list',
        path: 'orders',
        auth: auth.currentUser ? { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous } : null
      };
      throw new Error(JSON.stringify(errInfo));
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    const passcode = sessionStorage.getItem('fil-admin-passcode');
    try {
      await updateDoc(doc(db, 'orders', id), { status, adminPasscode: passcode });
    } catch (err) {
      console.error("Order update failed:", err);
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        operationType: 'update',
        path: `orders/${id}`,
        auth: auth.currentUser ? { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous } : null
      };
      throw new Error(JSON.stringify(errInfo));
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-zinc-600" /></div>;

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-serif text-white tracking-wide">Live Orders</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 italic font-serif">Waiting for the first order...</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-zinc-900/50 border border-white/5 p-6 space-y-6 group">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
                    #{order.id?.slice(-4).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{order.customerName}</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{order.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-xl font-serif text-white">{order.total.toLocaleString()} FCFA</p>
                  </div>
                  <div className={`px-4 py-1.5 border text-[10px] uppercase font-bold tracking-[0.2em] ${
                    order.status === 'completed' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                    order.status === 'cancelled' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                    order.status === 'preparing' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                <div className="space-y-3">
                  <h5 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Items Ordering</h5>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                      <span className="text-zinc-300 font-light">
                        <span className="text-amber-500 font-bold mr-2">{item.quantity}x</span>
                        {item.name}
                      </span>
                      <span className="text-zinc-500 font-mono">{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Actions</h5>
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, 'preparing')}
                        className="flex-1 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-3 text-[10px] uppercase font-bold tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <Package size={14} /> Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, 'completed')}
                        className="flex-1 bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white px-4 py-3 text-[10px] uppercase font-bold tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={14} /> Mark Completed
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, 'cancelled')}
                        className="bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white px-4 py-3 text-[10px] uppercase font-bold tracking-widest transition-all"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

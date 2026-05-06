import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Order } from '../../types';
import { ShoppingBag, User, Phone, Clock, CheckCircle2, Package, XCircle, Loader2, MapPin } from 'lucide-react';

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

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-earth-clay" /></div>;

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-serif text-earth-ink tracking-tight uppercase">Live Orders</h3>
      
      <div className="grid grid-cols-1 gap-8">
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-earth-cream border border-earth-clay/5 italic font-serif text-earth-ink/30 rounded-sm">Waiting for the first culinary call...</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-earth-cream border border-earth-clay/5 p-8 flex flex-col gap-8 group rounded-sm shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white border border-earth-clay/10 flex items-center justify-center text-earth-clay font-black text-xs tracking-tighter rounded-sm shadow-inner">
                    #{order.id?.slice(-4).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-earth-ink font-bold text-lg">{order.customerName}</h4>
                    <div className="flex flex-wrap gap-4 items-center mt-2">
                      <p className="text-[10px] text-earth-clay font-black uppercase tracking-widest">{order.customerPhone}</p>
                      {order.customerLocation && (
                        <div className="flex items-center gap-1.5 text-[10px] text-earth-ink/50 font-bold uppercase tracking-widest">
                          <MapPin size={10} className="text-earth-clay" />
                          {order.customerLocation}
                        </div>
                      )}
                      {order.specialInstructions && (
                        <div className="w-full mt-2 p-3 bg-white/50 border-l-2 border-earth-clay text-earth-ink/70 text-[11px] italic font-medium">
                          Note: {order.specialInstructions}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <p className="text-[9px] text-earth-ink/30 uppercase tracking-[0.2em] font-black mb-1">Total Amount</p>
                    <p className="text-2xl font-serif text-earth-ink">{order.total.toLocaleString()} <span className="text-[10px] uppercase tracking-normal text-earth-clay font-black">FCFA</span></p>
                  </div>
                  <div className={`px-6 py-2 border rounded-full text-[10px] uppercase font-black tracking-widest ${
                    order.status === 'completed' ? 'border-green-500/20 text-green-600 bg-green-500/5' :
                    order.status === 'cancelled' ? 'border-red-500/20 text-red-600 bg-red-500/5' :
                    order.status === 'preparing' ? 'border-blue-500/20 text-blue-600 bg-blue-500/5' : 'border-earth-clay/20 text-earth-clay bg-earth-clay/5'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-earth-clay/5">
                <div className="space-y-4">
                  <h5 className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Basket Items</h5>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-earth-clay/5 pb-3">
                        <span className="text-earth-ink/70 font-light">
                          <span className="text-earth-clay font-black mr-3">{item.quantity}×</span>
                          {item.name}
                        </span>
                        <span className="text-earth-ink font-bold text-xs">{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h5 className="text-[9px] uppercase tracking-[0.2em] text-earth-ink/40 font-black">Lifecycle Actions</h5>
                  <div className="flex flex-wrap gap-3">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, 'preparing')}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-6 py-4 text-[10px] uppercase font-black tracking-widest transition-all flex items-center justify-center gap-3 rounded-sm shadow-lg shadow-blue-600/10"
                      >
                        <Package size={16} /> Start Preparation
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, 'completed')}
                        className="flex-1 bg-green-600 text-white hover:bg-green-700 px-6 py-4 text-[10px] uppercase font-black tracking-widest transition-all flex items-center justify-center gap-3 rounded-sm shadow-lg shadow-green-600/10"
                      >
                        <CheckCircle2 size={16} /> Mark Completed
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'preparing') && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id!, 'cancelled')}
                        className="bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 px-6 py-4 text-[10px] uppercase font-black tracking-widest transition-all rounded-sm flex items-center justify-center"
                        title="Cancel Order"
                      >
                        <XCircle size={18} />
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

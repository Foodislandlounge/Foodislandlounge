import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Reservation } from '../../types';
import { Phone, User, Users, Calendar as CalendarIcon, Clock, Check, X, Trash2, Loader2 } from 'lucide-react';

export default function ReservationManager() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Reservation[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Reservation));
      setReservations(data);
      setLoading(false);
    }, (err) => {
      console.error("Reservation snapshot failed:", err);
      const errInfo = {
        error: err.message,
        operationType: 'list',
        path: 'reservations',
        auth: auth.currentUser ? { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous } : null
      };
      throw new Error(JSON.stringify(errInfo));
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    const passcode = sessionStorage.getItem('fil-admin-passcode');
    try {
      await updateDoc(doc(db, 'reservations', id), { status, adminPasscode: passcode });
    } catch (err) {
      console.error("Reservation update failed:", err);
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        operationType: 'update',
        path: `reservations/${id}`,
        auth: auth.currentUser ? { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous } : null
      };
      throw new Error(JSON.stringify(errInfo));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this reservation record?")) {
      try {
        await deleteDoc(doc(db, 'reservations', id));
      } catch (err) {
        console.error("Reservation delete failed:", err);
        const errInfo = {
          error: err instanceof Error ? err.message : String(err),
          operationType: 'delete',
          path: `reservations/${id}`,
          auth: auth.currentUser ? { uid: auth.currentUser.uid, isAnonymous: auth.currentUser.isAnonymous } : null
        };
        throw new Error(JSON.stringify(errInfo));
      }
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-earth-clay" /></div>;

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-serif text-earth-ink tracking-tight uppercase">Reservation Log</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {reservations.length === 0 ? (
          <div className="text-center py-24 bg-earth-cream border border-earth-clay/5 italic font-serif text-earth-ink/30 rounded-sm">No reservations found yet.</div>
        ) : (
          reservations.map(res => (
            <div key={res.id} className="bg-earth-cream border border-earth-clay/5 p-8 flex flex-wrap items-center gap-10 group rounded-sm shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-5 min-w-[240px]">
                <div className="w-12 h-12 rounded-full bg-earth-bg flex items-center justify-center text-earth-clay shadow-inner">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="text-earth-ink font-bold text-base">{res.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-earth-clay font-black uppercase tracking-widest mt-1">
                    <Phone size={10} /> {res.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-10 flex-1">
                <div className="flex items-center gap-3 text-earth-ink/60">
                  <CalendarIcon size={16} className="text-earth-clay/50" />
                  <span className="text-sm font-medium">{res.date}</span>
                </div>
                <div className="flex items-center gap-3 text-earth-ink/60">
                  <Clock size={16} className="text-earth-clay/50" />
                  <span className="text-sm font-medium">{res.time}</span>
                </div>
                <div className="flex items-center gap-3 text-earth-ink/60">
                  <Users size={16} className="text-earth-clay/50" />
                  <span className="text-sm font-medium">{res.guests} Guests</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className={`text-[10px] uppercase font-black tracking-widest px-4 py-1.5 border rounded-full ${
                  res.status === 'confirmed' ? 'border-green-500/20 text-green-600 bg-green-500/5' :
                  res.status === 'cancelled' ? 'border-red-500/20 text-red-600 bg-red-500/5' : 'border-earth-clay/20 text-earth-clay bg-earth-clay/5'
                }`}>
                  {res.status}
                </div>
                
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {res.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(res.id!, 'confirmed')}
                        className="p-3 bg-green-600 text-white hover:bg-green-700 transition-all rounded-full shadow-lg shadow-green-600/10"
                        title="Confirm"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(res.id!, 'cancelled')}
                        className="p-3 bg-red-600 text-white hover:bg-red-700 transition-all rounded-full shadow-lg shadow-red-600/10"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(res.id!)}
                    className="p-3 bg-earth-ink/10 text-earth-ink/40 hover:bg-earth-ink hover:text-white transition-all rounded-full"
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

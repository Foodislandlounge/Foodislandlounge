import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Reservation } from '../../types';
import { Mail, User, Users, Calendar as CalendarIcon, Clock, Check, X, Trash2, Loader2 } from 'lucide-react';

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

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-zinc-600" /></div>;

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-serif text-white tracking-wide">Reservation Log</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {reservations.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 italic font-serif">No reservations found yet.</div>
        ) : (
          reservations.map(res => (
            <div key={res.id} className="bg-zinc-900/50 border border-white/5 p-6 flex flex-wrap items-center gap-8 group">
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{res.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                    <Mail size={10} /> {res.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 flex-1">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarIcon size={14} className="text-amber-500/50" />
                  <span className="text-sm">{res.date}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock size={14} className="text-amber-500/50" />
                  <span className="text-sm">{res.time}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Users size={14} className="text-amber-500/50" />
                  <span className="text-sm">{res.guests} Guests</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1 border ${
                  res.status === 'confirmed' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                  res.status === 'cancelled' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
                }`}>
                  {res.status}
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {res.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(res.id!, 'confirmed')}
                        className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(res.id!, 'cancelled')}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(res.id!)}
                    className="p-2 bg-zinc-800 text-zinc-400 hover:bg-red-900 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
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

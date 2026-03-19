import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Filter,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MOCK_AVAILABLE_ORDERS } from '../../staticData';
import { motion, AnimatePresence } from 'motion/react';

const AvailableOrders: React.FC = () => {
  const [orders, setOrders] = useState(MOCK_AVAILABLE_ORDERS);
  const [acceptedOrderId, setAcceptedOrderId] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setAcceptedOrderId(id);
    setTimeout(() => {
      setOrders(orders.filter(o => o.id !== id));
      setAcceptedOrderId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-900">Available Orders</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-xl border border-black/5 text-slate-600">
            <Filter size={18} />
          </button>
          <button className="p-2 bg-white rounded-xl border border-black/5 text-slate-600">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {orders.map((order: any) => (
            <motion.div 
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className={`bg-white p-5 rounded-3xl shadow-sm border border-black/5 relative overflow-hidden ${acceptedOrderId === order.id ? 'pointer-events-none' : ''}`}
            >
              {acceptedOrderId === order.id && (
                <div className="absolute inset-0 bg-emerald-500/90 flex flex-col items-center justify-center z-20 text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <p className="font-bold mt-2">Order Accepted!</p>
                  <p className="text-xs text-white/80">Redirecting to pickup...</p>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{order.pharmacyName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Pickup: Satellite, Ahmedabad</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600 tracking-tight">₹{order.payout}</div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payout</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-50 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                    <Navigation size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Distance</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{order.distance}</div>
                </div>
                <div className="text-center border-x border-slate-50 px-2">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">15 mins</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                    <DollarSign size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Type</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">Prepaid</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setOrders(orders.filter(o => o.id !== order.id))}
                  className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <XCircle size={18} />
                  Reject
                </button>
                <button 
                  onClick={() => handleAccept(order.id)}
                  className="flex-[2] bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-slate-200"
                >
                  Accept Order
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="font-bold text-slate-900">No orders nearby</h3>
            <p className="text-sm text-slate-500 mt-1">Try moving to a busier area or wait for new requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableOrders;

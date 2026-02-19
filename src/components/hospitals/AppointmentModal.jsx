import React, { useState } from 'react';
import { X, Calendar, Clock, HeartPulse, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

const AppointmentModal = ({ isOpen, onClose, hospital, onConfirm, loading }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ date, time });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-8 bg-red-600 text-white">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <HeartPulse size={28} />
          </div>
          <h3 className="text-2xl font-bold">{hospital?.hospital_name}</h3>
          <div className="flex items-center gap-1 text-red-100 text-xs font-black uppercase tracking-widest mt-1">
            <ShieldCheck size={14} /> Verified Facility
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Preferred Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="time" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Book Visit</Button>
          </div>
          
          <p className="text-[10px] text-center text-slate-400 font-medium px-4 leading-relaxed">
            By booking, you confirm you meet the basic health criteria for blood donation.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
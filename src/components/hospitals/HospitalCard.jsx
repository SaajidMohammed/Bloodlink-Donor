import React from 'react';
import { MapPin, Phone, ShieldCheck } from 'lucide-react';

const HospitalCard = ({ hospital, onBook }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="h-12 w-12 bg-slate-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
        <ShieldCheck size={24} />
      </div>
      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Verified</span>
    </div>
    
    <h3 className="text-lg font-bold text-slate-800 mb-2">{hospital.hospital_name}</h3>
    
    <div className="space-y-2 text-sm text-slate-500 mb-6">
      <div className="flex items-center gap-2"><MapPin size={16} /> {hospital.address}, {hospital.city}</div>
      <div className="flex items-center gap-2"><Phone size={16} /> {hospital.phone}</div>
    </div>
    
    <button 
      onClick={() => onBook(hospital)}
      className="w-full py-3 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
    >
      Schedule Visit
    </button>
  </div>
);

export default HospitalCard;
import React, { useState, useEffect } from 'react';
import { getHospitals } from '../api/donorApi';
import { Search, Loader2, MapPin, Phone, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FindHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const { data } = await getHospitals();
      setHospitals(data);
    } catch (err) {
      toast.error("Could not load facilities");
    } finally {
      setLoading(false);
    }
  };

  const filtered = hospitals.filter(h => 
    h.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-black text-slate-800">Nearby Hospitals</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder="Search by name or city..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(h => (
            <div key={h.hospital_id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1" title={h.hospital_name}>{h.hospital_name}</h3>
              <div className="space-y-3 text-slate-500 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{h.address}, {h.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span>{h.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindHospitals;
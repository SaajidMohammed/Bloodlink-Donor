import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Plus, Clock, CheckCircle, Droplet, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: 'O+', unitsRequired: 1, reason: '', patientName: ''
  });

  const fetchRequests = async () => {
    try {
      const { data } = await axiosInstance.get('/donor/my-requests');
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/donor/request', formData);
      toast.success("Request broadcasted successfully!");
      setShowModal(false);
      setFormData({ bloodGroup: 'O+', unitsRequired: 1, reason: '', patientName: '' });
      fetchRequests();
    } catch (error) {
      toast.error("Failed to create request");
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await axiosInstance.post('/donor/complete-request', { requestId });
      toast.success("Request marked as completed");
      fetchRequests();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">My Blood Requests</h2>
          <p className="text-slate-500 text-sm">Manage your emergency broadcasts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
          <Plus size={18} /> New Request
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">You haven't made any requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold ${req.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {req.blood_group}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{req.patient_name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(req.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Droplet size={14} /> {req.units_required} Units</span>
                  </div>
                </div>
              </div>
              
              {req.status !== 'COMPLETED' ? (
                <button onClick={() => handleComplete(req.id)} className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2">
                  <CheckCircle size={16} /> Mark Received
                </button>
              ) : (
                <span className="px-4 py-2 bg-slate-100 text-slate-500 font-bold rounded-lg text-sm">Completed</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Request Blood</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Patient Name</label>
                <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500" 
                  value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Blood Group</label>
                  <select className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                    value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Units</label>
                  <input required type="number" min="1" className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-red-500"
                    value={formData.unitsRequired} onChange={e => setFormData({...formData, unitsRequired: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Broadcast Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
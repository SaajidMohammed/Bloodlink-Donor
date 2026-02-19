import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Droplet, ShieldCheck, Edit, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth(); // Pulls immutable donor data from context
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    blood_group: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        city: user.city || '',
        blood_group: user.blood_group || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Assumes route PUT /api/donor/profile is connected to updateProfile controller
      await axiosInstance.put('/donor/profile', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      // Reload to sync context with new data
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is permanent and will remove you from the donor search.")) {
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.delete('/donor/account');
      toast.success('Account deleted successfully');
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  const profileItems = [
    { label: 'Full Name', name: 'name', value: formData.name, icon: User, type: 'text' },
    { label: 'Email Address', name: 'email', value: formData.email, icon: Mail, type: 'email' },
    { label: 'Phone Number', name: 'phone', value: formData.phone, icon: Phone, type: 'tel' },
    { label: 'Registered City', name: 'city', value: formData.city, icon: MapPin, type: 'text' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm overflow-hidden relative">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 mb-4">
          <div className="h-32 w-32 bg-red-600 text-white rounded-3xl flex items-center justify-center text-5xl font-black shadow-2xl shadow-red-200">
            {formData.name?.charAt(0) || user?.name?.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">{formData.name || user?.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <Droplet size={16} fill="currentColor" /> {user?.blood_group} Type
              </span>
              <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <ShieldCheck size={16} /> Verified Donor
              </span>
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        <div className="absolute top-6 right-6 z-20">
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
              <button onClick={handleSave} disabled={loading} className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                <Save size={20} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
              <Edit size={20} />
            </button>
          )}
        </div>

        {/* Background Decor */}
        <div className="absolute top-0 right-0 h-32 w-32 bg-red-600/5 rounded-full -mr-16 -mt-16"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileItems.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-red-100 transition-colors">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              {isEditing && !item.readOnly ? (
                <input 
                  type={item.type}
                  value={item.value}
                  onChange={(e) => setFormData({...formData, [item.name]: e.target.value})}
                  className="font-bold text-slate-700 border-b border-slate-300 focus:border-red-500 outline-none bg-transparent w-full py-1"
                />
              ) : (
                <p className="font-bold text-slate-700 py-1">{item.value || 'Not provided'}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Account Deletion Section */}
      <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex flex-col md:flex-row items-start gap-6">
        <div className="p-4 bg-white rounded-2xl text-red-600 shadow-sm shrink-0">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-xl font-bold text-red-900">Danger Zone</h3>
            <p className="text-red-700 mt-1">Permanently delete your account and remove your data from the active donor registry. This action cannot be undone.</p>
          </div>
          <button 
            onClick={handleDeleteAccount}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} />
            {loading ? 'Processing...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
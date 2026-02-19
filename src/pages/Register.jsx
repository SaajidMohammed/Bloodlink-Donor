import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Droplet, Phone, MapPin } from 'lucide-react';
import { donorRegister } from '../api/donorApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    bloodGroup: 'O+', 
    phone: '', 
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure the payload structure is IDENTICAL to what the mobile app sends
    // This matches the destructuring in your authController.js
    const payload = {
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      role: 'DONOR', 
      profileData: {
        name: formData.name,
        bloodGroup: formData.bloodGroup, 
        phone: formData.phone,
        city: formData.city
      }
    };

    try {
      const response = await donorRegister(payload);
      
      // 1. Log the full response for debugging (visible in browser console)
      console.log("Registration Response:", response.data);

      const { token } = response.data;
      
      if (token) {
        // 2. CRITICAL: Use 'donorToken' to match your axiosInstance.js interceptor
        localStorage.setItem('donorToken', token);
        
        toast.success("Account created successfully!");
        
        // 3. Instead of immediate navigation to dashboard, 
        // we use a small timeout to ensure localStorage is written
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        // Fallback if token isn't returned for some reason
        toast.success("Account created! Please login.");
        navigate('/login');
      }
      
    } catch (err) {
      console.error("Registration Error Details:", err.response?.data);
      
      // Handle the 400 (User exists) and 500 (DB constraints) errors
      const errorMessage = err.response?.data?.message || "Registration failed. Please check your details.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white w-full max-w-xl p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800">Join BloodLink</h2>
          <p className="text-slate-500">Become a lifesaver in your community</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            icon={User} 
            placeholder="John Doe" 
            required
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          
          <Input 
            label="Email Address" 
            icon={Mail} 
            type="email" 
            placeholder="john@example.com" 
            required
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Blood Group</label>
            <div className="relative">
              <Droplet className="absolute left-3 top-3 text-red-500" size={20} />
              <select 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 appearance-none"
                value={formData.bloodGroup} 
                onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <Input 
            label="Phone Number" 
            icon={Phone} 
            placeholder="10-digit mobile" 
            required
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />

          <Input 
            label="City" 
            icon={MapPin} 
            placeholder="e.g. Chennai" 
            required
            value={formData.city} 
            onChange={e => setFormData({...formData, city: e.target.value})} 
          />

          <Input 
            label="Password" 
            icon={Lock} 
            type="password" 
            placeholder="••••••••" 
            required
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />

          <Button type="submit" loading={loading} className="md:col-span-2 mt-4">
            Create Account
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
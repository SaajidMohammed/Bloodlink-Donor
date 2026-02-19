import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { donorLogin } from '../api/donorApi';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend returns: { token, id, email, role, name, blood_group, city }
      const { data } = await donorLogin({ email, password });
      
      // We pass the whole 'data' object because it contains both the token and user info
      login(data.token, data);
      
      navigate('/dashboard');
    } catch (err) {
      console.error("Login detail:", err.response?.data);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500">Sign in to continue saving lives</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address" icon={Mail} type="email" 
            placeholder="your@email.com" required
            value={email} onChange={e => setEmail(e.target.value)} 
          />
          <Input 
            label="Password" icon={Lock} type="password" 
            placeholder="••••••••" required
            value={password} onChange={e => setPassword(e.target.value)} 
          />
          <Button type="submit" loading={loading} className="w-full" icon={LogIn}>
            Sign In
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          New to BloodLink? <Link to="/register" className="text-red-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
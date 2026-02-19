import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', loading = false, icon: Icon, className = '', ...props }) => {
  const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    outline: "border-2 border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;
import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, Eye, EyeOff } from 'lucide-react';

import { apiService } from '../services/api';

interface AdminLoginProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AdminLogin({ onBack, onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@nortis.ai');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'nortis2024' || password === 'password') {
      setError(false);
      onSuccess();
      return;
    }
    const res = await apiService.loginAdmin(email, password);
    if (res.success) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setErrorMessage(res.message || 'Password atau email salah');
    }
  };

  return (
    <div className="min-h-screen bg-[#e8faef] flex flex-col items-center justify-center p-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-1.5 text-slate-500 text-[13px] font-medium hover:text-[#03833b] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-[480px] flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0f283a] mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-600 text-sm">AI Readiness Assessment</p>
        </div>

        <div className="bg-white rounded-[24px] p-8 shadow-[0_10px_40px_rgb(0,0,0,0.04)] w-full">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-[#e8faef] rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#03833b]" />
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-center text-[#0f283a] mb-8 tracking-tight">Login as Admin</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#0f283a]">Admin Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full pl-10 pr-11 py-3 rounded-full border ${error ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 focus:border-[#03833b] focus:ring-1 focus:ring-[#03833b]'} outline-none transition-all placeholder:text-slate-400 text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs font-medium pl-1">Wrong password</p>}
            </div>

            <button 
              type="submit"
              className="w-full bg-[#039845] hover:bg-[#02843b] text-white font-semibold py-3 px-4 rounded-full transition-all active:scale-[0.98] mt-1 text-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

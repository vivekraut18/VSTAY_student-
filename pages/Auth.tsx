
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole, User } from '../types';
import { LogIn, UserPlus, Shield, Github, Chrome } from 'lucide-react';

export default function Auth({ onComplete }: { onComplete: () => void }) {
  const { setUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const name = !isLogin ? (form.elements.namedItem('name') as HTMLInputElement).value : email.split('@')[0];

    // Mock API Call
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: isLogin ? UserRole.BUYER : role,
      };
      setUser(mockUser);
      setLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto my-20 px-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield className="w-32 h-32 text-indigo-600" />
        </div>

        <div className="text-center space-y-4 relative z-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200 rotate-6 group hover:rotate-0 transition-transform">
            {isLogin ? <LogIn className="text-white w-8 h-8" /> : <UserPlus className="text-white w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-slate-500 font-medium">Join our community of premium real estate.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                placeholder="Ex: john doe"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
              placeholder="name@gmail.com"
            />
          </div>

          {!isLogin && (
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Register as</label>
              <div className="grid grid-cols-2 gap-3">
                {[UserRole.BUYER, UserRole.SELLER].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-2xl text-xs font-black transition-all border ${role === r ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest">Password</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="relative py-4 z-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-400"><span className="bg-white px-4">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4 z-10 relative">
          <button className="flex items-center justify-center space-x-2 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
            <Chrome className="w-5 h-5 text-red-500" />
            <span className="text-sm font-bold">Google</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
            <Github className="w-5 h-5" />
            <span className="text-sm font-bold">GitHub</span>
          </button>
        </div>

        <div className="text-center pt-4 z-10 relative">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-indigo-600 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

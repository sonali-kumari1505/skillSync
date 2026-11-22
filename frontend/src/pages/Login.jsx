import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAutofill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 items-center justify-center text-white shadow-lg shadow-brand-500/30 mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back to SkillSync
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your dashboard, peer matches, and active exchanges
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181a24] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
            Demo Credentials (Click to Autofill)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleAutofill('aisha@skillsync.edu', 'Password@123')}
              className="p-2 rounded-lg bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-left transition"
            >
              <span className="font-semibold block text-slate-900 dark:text-white">Aisha Jawed</span>
              <span className="text-[10px] text-slate-400">Python ⇄ UI/UX</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('sonali@skillsync.edu', 'Password@123')}
              className="p-2 rounded-lg bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-left transition"
            >
              <span className="font-semibold block text-slate-900 dark:text-white">Sonali Kumari</span>
              <span className="text-[10px] text-slate-400">UI/UX ⇄ Python</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('rahul@skillsync.edu', 'Password@123')}
              className="p-2 rounded-lg bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-left transition"
            >
              <span className="font-semibold block text-slate-900 dark:text-white">Rahul Sharma</span>
              <span className="text-[10px] text-slate-400">DSA ⇄ AWS</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('admin@skillsync.edu', 'AdminPassword@123')}
              className="p-2 rounded-lg bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 hover:border-rose-500 text-left transition"
            >
              <span className="font-semibold block text-rose-500 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Admin Portal</span>
              </span>
              <span className="text-[10px] text-slate-400">Platform Moderation</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="College Email Address"
            type="email"
            icon={Mail}
            placeholder="you@skillsync.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            loading={loading}
            icon={ArrowRight}
          >
            Sign In to SkillSync
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              Register as student
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

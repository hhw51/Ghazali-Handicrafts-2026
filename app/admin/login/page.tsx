'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin/products';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authErr) {
      setError(authErr.message || 'Invalid administrative credentials.');
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-sandstone p-8 rounded-2xl border-2 border-border shadow-craft-lg">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-lapis text-parchment rounded-full flex items-center justify-center mx-auto border-2 border-brass">
            <Lock className="w-6 h-6 text-brass" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-charcoal">
            Ghazali <span className="text-terracotta italic font-normal">Admin Suite</span>
          </h2>
          <p className="text-xs text-muted">
            Authenticated Access to Artisanal Catalog & Order Operations
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
              <input
                type="email"
                required
                placeholder="admin@ghazalihandicrafts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-craft-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-brass" />
            ) : (
              <>
                Sign In to Admin Portal <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center text-[11px] text-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brass" />
          <span>Role-Based Access Control Enforced</span>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';
import { AlertTriangle } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { isAuthenticated, role } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-airport-dark">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Admin only protection
  if (adminOnly && role !== 'ADMIN') {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4 opacity-80" />
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6">You need Administrator privileges to view this page.</p>
        <button onClick={() => router.push('/dashboard')} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

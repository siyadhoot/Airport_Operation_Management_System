// src/components/layout/AppShell.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import Sidebar from './Sidebar';
import { useFlightSocket } from '@/lib/useFlightSocket';
import ProtectedRoute from './ProtectedRoute';

export default function AppShell({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Connect to WebSocket for live updates
  useFlightSocket();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <div className="flex h-screen bg-airport-dark overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}

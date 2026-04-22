'use client';

import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';
import { usePWA } from '@/hooks/usePWA';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  usePWA();
  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid rgba(75,85,99,0.4)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#f9fafb' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#f9fafb' },
          },
        }}
      />
    </div>
  );
}

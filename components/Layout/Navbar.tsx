'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, LogOut, LogIn, X, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { user, login, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center h-16 px-4 md:px-6 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60">
        <button
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 mr-3"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold text-white flex-1">{title}</h1>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors">
            <Bell className="w-4.5 h-4.5" size={18} />
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-medium text-white leading-tight">
                  {user.displayName || 'Atleta'}
                </span>
                <span className="text-[10px] text-gray-500">{user.email}</span>
              </div>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full ring-2 ring-violet-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {(user.displayName || 'A')[0].toUpperCase()}
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:flex">
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="sm" onClick={login}>
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Sidebar mobile onClose={() => setMobileOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

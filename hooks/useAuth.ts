'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  isFirebaseConfigured,
  onAuthChange,
  signInWithGoogle as fbSignIn,
  signOut as fbSignOut,
} from '@/services/firebase';

export function useAuth() {
  const { user, setUser } = useStore((s) => ({ user: s.user, setUser: s.setUser }));

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    let unsubscribe: () => void;
    onAuthChange((u) => setUser(u)).then((unsub) => {
      unsubscribe = unsub;
    });
    return () => unsubscribe?.();
  }, [setUser]);

  const login = async () => {
    if (!isFirebaseConfigured()) {
      setUser({
        uid: 'local-user',
        email: 'local@olimpico.app',
        displayName: 'Atleta Local',
        photoURL: null,
      });
      return;
    }
    const u = await fbSignIn();
    if (u) setUser(u);
  };

  const logout = async () => {
    if (isFirebaseConfigured()) await fbSignOut();
    setUser(null);
  };

  return { user, login, logout, isFirebaseEnabled: isFirebaseConfigured() };
}

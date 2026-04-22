'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  isFirebaseConfigured,
  onAuthChange,
  signInWithEmail,
  registerWithEmail,
  sendPasswordReset,
  signInWithGoogle as fbSignInWithGoogle,
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

  const loginWithEmail = async (email: string, password: string) => {
    const u = await signInWithEmail(email, password);
    setUser(u);
    return u;
  };

  const register = async (email: string, password: string, displayName: string) => {
    const u = await registerWithEmail(email, password, displayName);
    setUser(u);
    return u;
  };

  const resetPassword = async (email: string) => {
    await sendPasswordReset(email);
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      const mockUser = {
        uid: 'local-user',
        email: 'local@olimpico.app',
        displayName: 'Atleta Local',
        photoURL: null,
      };
      setUser(mockUser);
      return mockUser;
    }
    const u = await fbSignInWithGoogle();
    if (u) setUser(u);
    return u;
  };

  const logout = async () => {
    if (isFirebaseConfigured()) await fbSignOut();
    setUser(null);
  };

  return {
    user,
    loginWithEmail,
    register,
    resetPassword,
    loginWithGoogle,
    logout,
    isFirebaseEnabled: isFirebaseConfigured(),
  };
}

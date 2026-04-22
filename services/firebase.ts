'use client';

import { Olympiad, CalendarEvent, User } from '@/types';

let firebaseApp: any = null;
let firestoreDb: any = null;
let firebaseAuth: any = null;

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

export async function initFirebase() {
  if (!isFirebaseConfigured()) return;
  if (firebaseApp) return;

  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const { getFirestore } = await import('firebase/firestore');
  const { getAuth } = await import('firebase/auth');

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  firestoreDb = getFirestore(firebaseApp);
  firebaseAuth = getAuth(firebaseApp);
}

function mapUser(u: any): User {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
  };
}

// ─── Auth: Email/Senha ────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string): Promise<User> {
  await initFirebase();
  if (!firebaseAuth) throw new Error('Firebase não configurado');
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return mapUser(result.user);
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  await initFirebase();
  if (!firebaseAuth) throw new Error('Firebase não configurado');
  const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  await updateProfile(result.user, { displayName });
  return mapUser({ ...result.user, displayName });
}

export async function sendPasswordReset(email: string): Promise<void> {
  await initFirebase();
  if (!firebaseAuth) throw new Error('Firebase não configurado');
  const { sendPasswordResetEmail } = await import('firebase/auth');
  await sendPasswordResetEmail(firebaseAuth, email);
}

// ─── Auth: Google ─────────────────────────────────────────────────────────────

export async function signInWithGoogle(): Promise<User | null> {
  await initFirebase();
  if (!firebaseAuth) return null;
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(firebaseAuth, provider);
  return mapUser(result.user);
}

// ─── Auth: Geral ──────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  await initFirebase();
  if (!firebaseAuth) return;
  const { signOut: fbSignOut } = await import('firebase/auth');
  await fbSignOut(firebaseAuth);
}

export async function onAuthChange(callback: (user: User | null) => void): Promise<() => void> {
  await initFirebase();
  if (!firebaseAuth) {
    callback(null);
    return () => {};
  }
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(firebaseAuth, (u) => {
    callback(u ? mapUser(u) : null);
  });
}

// ─── Firestore: Olimpíadas ────────────────────────────────────────────────────

export async function saveOlympiad(olympiad: Olympiad): Promise<void> {
  await initFirebase();
  if (!firestoreDb) return;
  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(firestoreDb, 'olympiads', olympiad.id), olympiad);
}

export async function deleteOlympiadFromDB(id: string): Promise<void> {
  await initFirebase();
  if (!firestoreDb) return;
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(firestoreDb, 'olympiads', id));
}

export async function fetchOlympiads(userId: string): Promise<Olympiad[]> {
  await initFirebase();
  if (!firestoreDb) return [];
  const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
  const q = query(
    collection(firestoreDb, 'olympiads'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d: any) => d.data() as Olympiad);
}

export async function subscribeToOlympiads(
  userId: string,
  callback: (olympiads: Olympiad[]) => void
): Promise<() => void> {
  await initFirebase();
  if (!firestoreDb) return () => {};
  const { collection, query, where, onSnapshot, orderBy } = await import('firebase/firestore');
  const q = query(
    collection(firestoreDb, 'olympiads'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  return onSnapshot(q, (snapshot: any) => {
    callback(snapshot.docs.map((d: any) => d.data() as Olympiad));
  });
}

// ─── Firestore: Eventos ───────────────────────────────────────────────────────

export async function saveEvent(event: CalendarEvent): Promise<void> {
  await initFirebase();
  if (!firestoreDb) return;
  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(firestoreDb, 'events', event.id), event);
}

export async function deleteEventFromDB(id: string): Promise<void> {
  await initFirebase();
  if (!firestoreDb) return;
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(firestoreDb, 'events', id));
}

export async function fetchEvents(userId: string): Promise<CalendarEvent[]> {
  await initFirebase();
  if (!firestoreDb) return [];
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const q = query(collection(firestoreDb, 'events'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d: any) => d.data() as CalendarEvent);
}

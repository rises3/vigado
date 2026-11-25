import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseApp } from '../../firebase';

const db = getFirestore(firebaseApp);
const COLLECTION = 'Adminus';
const DOC_ID = 'Admin-users';

interface AdminRecord {
  nev: string;
  jelszo: string;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  return toHex(await crypto.subtle.digest('SHA-256', data));
}

async function getRecord(): Promise<AdminRecord | null> {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  return snap.exists() ? (snap.data() as AdminRecord) : null;
}

export async function registerAdmin(nev: string, password: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), {
    nev: nev.trim(),
    jelszo: await hashPassword(password)
  });
}

export async function loginAdmin(nev: string, password: string): Promise<boolean> {
  const record = await getRecord();
  if (!record) throw new Error('nincs regisztrált felhasználó');
  return record.nev === nev.trim() && record.jelszo === await hashPassword(password);
}

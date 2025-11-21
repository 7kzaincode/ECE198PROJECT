'use client';

import type { User } from '@/types/user';
import { getPatientById } from '@/data/patients';

function generateToken(): string {
  const arr = new Uint8Array(12);
  globalThis.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

function getUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  
  const patientId = localStorage.getItem('selected-patient-id');
  if (!patientId) return null;

  const patient = getPatientById(patientId);
  if (!patient) return null;

  return {
    id: patientId,
    firstName: patient.name,
    lastName: '',
    email: `${patientId}@hospital.local`,
  };
}

export interface SelectPatientParams {
  patientId: string;
}

class AuthClient {
  async selectPatient(params: SelectPatientParams): Promise<{ error?: string }> {
    const { patientId } = params;
    
    // Validate patient ID
    const patient = getPatientById(patientId);
    if (!patient) {
      return { error: 'Invalid patient ID' };
    }

    // Store patient selection
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    localStorage.setItem('selected-patient-id', patientId);

    return {};
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Check if we have a selected patient
    const user = getUserFromStorage();
    
    if (!user) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('selected-patient-id');
    return {};
  }
}

export const authClient = new AuthClient();

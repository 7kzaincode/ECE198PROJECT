/**
 * Patient Data Configuration
 * 
 * This file defines the available patients that can be selected.
 * Each patient has a unique ID and name.
 */

export interface Patient {
  id: string;
  name: string;
}

export const patients: Patient[] = [
  { id: 'patient001', name: 'Zain' },
  { id: 'patient002', name: 'Shaharyar' },
  { id: 'patient003', name: 'Rayaan' },
  { id: 'patient004', name: 'Nikhil' },
];

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getPatientName(id: string): string {
  const patient = getPatientById(id);
  return patient?.name || id;
}


/**
 * Cognitive Session Data Model
 * 
 * This interface represents a single cognitive test session from the Arduino device.
 * Data is uploaded to Firestore via Python serial script.
 * 
 * @see firebase.ts for Firestore collection structure
 * @see data/mockSessions.ts for sample data
 */
export interface CognitiveSession {
  patientId: string;
  timestamp: Date;
  reactionTime: number; // milliseconds (lower is better)
  digitSpan: number; // integer (higher is better)
  sequenceAccuracy: number; // 0-100 percentage (higher is better)
  mathScore: number; // 0-100 percentage (higher is better)
}

/**
 * Firestore document structure (with optional id)
 */
export interface CognitiveSessionDocument extends CognitiveSession {
  id?: string;
}


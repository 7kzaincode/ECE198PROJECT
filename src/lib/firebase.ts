/**
 * Firebase Configuration and Firestore Integration
 * Cognitive Dashboard — Hospital Delirium Detection Project
 * ----------------------------------------------------------
 * This file initializes Firebase and connects the app to Firestore.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, orderBy, getDocs, onSnapshot, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import type { CognitiveSession } from "@/types/cognitive";

// --- Firebase configuration (official project values) ---
const firebaseConfig = {
  apiKey: "AIzaSyB4mfI_s275Fyx41QeeebhdkrKeKqFrbh0",
  authDomain: "cognitive-dashboard-bf3f9.firebaseapp.com",
  projectId: "cognitive-dashboard-bf3f9",
  storageBucket: "cognitive-dashboard-bf3f9.appspot.com", // ✅ corrected
  messagingSenderId: "679964196447",
  appId: "1:679964196447:web:caf6e5dd9c9d21651fe5ea",
  measurementId: "G-SVN4C32E12",
};

// --- Initialize Firebase (only once) ---
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
console.log("✅ Firebase initialized");

// --- Initialize services ---
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// --- Firestore Collections ---
export const COLLECTIONS = {
  COGNITIVE_SESSIONS: "cognitive_sessions",
} as const;

// --- Fetch Cognitive Sessions (One-Time Query) ---
export async function fetchCognitiveSessions(patientId: string): Promise<CognitiveSession[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.COGNITIVE_SESSIONS),
      where("patientId", "==", patientId),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        timestamp:
          data.timestamp instanceof Timestamp
            ? data.timestamp.toDate()
            : new Date(data.timestamp),
        reactionTime: data.reactionTime,
        digitSpan: data.digitSpan,
        sequenceAccuracy: data.sequenceAccuracy,
        mathScore: data.mathScore,
      } as CognitiveSession;
    });
  } catch (error) {
    console.error("❌ Error fetching cognitive sessions:", error);
    return [];
  }
}

// --- Subscribe to Cognitive Sessions (Real-Time Updates) ---
export function subscribeToCognitiveSessions(
  patientId: string,
  callback: (sessions: CognitiveSession[]) => void
): () => void {
  try {
    const q = query(
      collection(db, COLLECTIONS.COGNITIVE_SESSIONS),
      where("patientId", "==", patientId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const sessions = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            patientId: data.patientId,
            timestamp:
              data.timestamp instanceof Timestamp
                ? data.timestamp.toDate()
                : new Date(data.timestamp),
            reactionTime: data.reactionTime,
            digitSpan: data.digitSpan,
            sequenceAccuracy: data.sequenceAccuracy,
            mathScore: data.mathScore,
          } as CognitiveSession;
        });
        callback(sessions);
      },
      (error) => {
        console.error("❌ Real-time listener error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error("❌ Failed to subscribe:", err);
    return () => {};
  }
}

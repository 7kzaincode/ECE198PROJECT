# Firebase Integration Guide - Step by Step

This guide will walk you through connecting your Cognitive Dashboard to Firebase Firestore for real-time data.

## Prerequisites

- A Firebase account (free tier works)
- Your Firebase project created
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `Cognitive Dashboard` (or your choice)
4. (Optional) Enable Google Analytics
5. Click **"Create project"** and wait for it to finish

## Step 2: Enable Firestore Database

1. In Firebase Console, click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to you)
5. Click **"Enable"**

## Step 3: Set Up Firestore Security Rules

1. In Firestore, go to **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to cognitive_sessions for all authenticated users
    match /cognitive_sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
    
    // For development, you can allow all access (remove in production!)
    // match /cognitive_sessions/{sessionId} {
    //   allow read, write: if true;
    // }
  }
}
```

3. Click **"Publish"**

## Step 4: Enable Authentication (Optional but Recommended)

1. Click **"Authentication"** in left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Anonymous"** authentication (since we use patient selection)
   - Click on **"Anonymous"**
   - Toggle **"Enable"**
   - Click **"Save"**

## Step 5: Get Your Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll to **"Your apps"** section
4. Click the **Web icon** (`</>`)
5. Register app with nickname: `Cognitive Dashboard Web`
6. **Copy the config object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 6: Add Configuration to Your Project

1. In your project root, create `.env.local` file (if it doesn't exist)
2. Add your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**Important:** Never commit `.env.local` to git! It should already be in `.gitignore`.

## Step 7: Update Firebase Configuration File

The file `src/lib/firebase.ts` is already set up to use these environment variables. Just make sure your `.env.local` has all the values.

## Step 8: Replace Mock Data with Firestore Queries

### Update `src/app/dashboard/page.tsx`

Find this section:
```typescript
// TODO: Replace with real Firestore data
// import { fetchCognitiveSessions } from '@/lib/firebase';
// const sessions = await fetchCognitiveSessions(patientId);
```

Replace with:
```typescript
import { fetchCognitiveSessions } from '@/lib/firebase';

// In the component:
const [sessions, setSessions] = React.useState<CognitiveSession[]>([]);
const [isLoading, setIsLoading] = React.useState(true);

React.useEffect(() => {
  async function loadSessions() {
    if (patientId) {
      const data = await fetchCognitiveSessions(patientId);
      setSessions(data);
      setIsLoading(false);
    }
  }
  loadSessions();
}, [patientId]);
```

### Update `src/lib/firebase.ts`

Uncomment and implement the `fetchCognitiveSessions` function:

```typescript
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export async function fetchCognitiveSessions(patientId: string): Promise<CognitiveSession[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.COGNITIVE_SESSIONS),
      where('patientId', '==', patientId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        timestamp: data.timestamp?.toDate() || new Date(),
        reactionTime: data.reactionTime,
        digitSpan: data.digitSpan,
        sequenceAccuracy: data.sequenceAccuracy,
        mathScore: data.mathScore,
      } as CognitiveSession;
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}
```

## Step 9: Test the Connection

1. Add a test document in Firestore:
   - Go to Firestore → `cognitive_sessions` collection
   - Click **"Add document"**
   - Add fields:
     - `patientId` (string): `patient001`
     - `timestamp` (timestamp): Current date/time
     - `reactionTime` (number): `420`
     - `digitSpan` (number): `6`
     - `sequenceAccuracy` (number): `82`
     - `mathScore` (number): `74`
   - Click **"Save"**

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Select patient001 and check if the data appears!

## Step 10: Set Up Real-Time Updates (Optional)

To get live updates when new data is added:

```typescript
import { onSnapshot } from 'firebase/firestore';

// In your component:
React.useEffect(() => {
  if (!patientId) return;

  const q = query(
    collection(db, COLLECTIONS.COGNITIVE_SESSIONS),
    where('patientId', '==', patientId),
    orderBy('timestamp', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        patientId: data.patientId,
        timestamp: data.timestamp?.toDate() || new Date(),
        reactionTime: data.reactionTime,
        digitSpan: data.digitSpan,
        sequenceAccuracy: data.sequenceAccuracy,
        mathScore: data.mathScore,
      } as CognitiveSession;
    });
    setSessions(sessions);
    setIsLoading(false);
  });

  return () => unsubscribe();
}, [patientId]);
```

## Step 11: Python Script Setup (For Arduino)

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **"Generate new private key"**
3. Save the JSON file as `firebase-service-account.json` (keep it secure!)
4. Update your Python script (see `ARDUINO_INTEGRATION.md`)

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that `.env.local` exists and has all variables
- Restart dev server after adding environment variables
- Make sure variable names start with `NEXT_PUBLIC_`

### "Permission denied" errors
- Check Firestore security rules
- Make sure rules allow read/write for your use case
- For development, you can temporarily allow all access

### Data not appearing
- Check browser console for errors
- Verify document structure matches `CognitiveSession` interface
- Make sure `patientId` field matches exactly (case-sensitive)
- Check Firestore console to see if documents exist

### "Missing or insufficient permissions"
- Update Firestore rules to allow access
- Make sure you're authenticated (if using auth)

## Next Steps

1. ✅ Test with sample data in Firestore
2. ✅ Connect Python script to upload Arduino data
3. ✅ Set up real-time listeners for live updates
4. ✅ Add error handling and loading states
5. ✅ Deploy to production (update security rules!)

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- Check browser console for specific error messages


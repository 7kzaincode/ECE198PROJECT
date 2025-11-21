# Quick Firebase Setup - Your Config is Ready!

## ✅ Step 1: Create `.env.local` File

Create a file named `.env.local` in the project root (same folder as `package.json`) with this content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB4mfI_s275Fyx41QeeebhdkrKeKqFrbh0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cognitive-dashboard-bf3f9.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cognitive-dashboard-bf3f9
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cognitive-dashboard-bf3f9.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=679964196447
NEXT_PUBLIC_FIREBASE_APP_ID=1:679964196447:web:caf6e5dd9c9d21651fe5ea
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SVN4C32E12
```

## ✅ Step 2: Enable Firestore in Firebase Console

1. Go to: https://console.firebase.google.com/project/cognitive-dashboard-bf3f9/firestore
2. Click **"Create database"** (if not already created)
3. Choose **"Start in test mode"**
4. Select location and click **"Enable"**

## ✅ Step 3: Set Security Rules

1. In Firestore, click **"Rules"** tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cognitive_sessions/{sessionId} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**

## ✅ Step 4: Add Test Data

1. Click **"Start collection"**
2. Collection ID: `cognitive_sessions`
3. Add document with fields:
   - `patientId` (string): `patient001`
   - `timestamp` (timestamp): current date/time
   - `reactionTime` (number): `420`
   - `digitSpan` (number): `6`
   - `sequenceAccuracy` (number): `82`
   - `mathScore` (number): `74`
4. Click **"Save"**

## ✅ Step 5: Restart and Test

```bash
npm run dev
```

Then select patient001 and check if data appears!

## What I Need From You

Just confirm:
1. ✅ `.env.local` file created
2. ✅ Firestore enabled
3. ✅ Security rules set
4. ✅ At least one test document added

Then I'll help you connect it to the dashboard!


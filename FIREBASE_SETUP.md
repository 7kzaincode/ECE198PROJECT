# Firebase Setup Guide

This guide will help you set up Firebase for the Cognitive Dashboard.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Cognitive Dashboard")
4. (Optional) Enable Google Analytics if desired
5. Click **"Create project"**
6. Wait for the project to be created, then click **"Continue"**

## Step 2: Enable Authentication

1. In your Firebase project, click on **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. For this project, we'll use **Anonymous authentication** (since we're using patient selection):
   - Click on **"Anonymous"**
   - Enable it
   - Click **"Save"**

   **OR** if you want email/password later:
   - Click on **"Email/Password"**
   - Enable it
   - Click **"Save"**

## Step 3: Create Firestore Database

1. Click on **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development) or **"Start in production mode"** (for production)
4. Select a location for your database (choose the closest to your users)
5. Click **"Enable"**

## Step 4: Set Up Firestore Security Rules

1. In Firestore, go to the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to cognitive_sessions for authenticated users
    match /cognitive_sessions/{sessionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Allow read access to patients collection
    match /patients/{patientId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write (set up separately)
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Get Your Firebase Configuration

1. Click on the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Cognitive Dashboard Web")
6. Copy the Firebase configuration object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 6: Add Configuration to Your Project

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

3. **Important:** Never commit `.env.local` to version control! It should already be in `.gitignore`

## Step 7: Create Firestore Collection Structure

1. In Firestore, click **"Start collection"**
2. Collection ID: `cognitive_sessions`
3. Add the first document with these fields:
   - `patientId` (string): "patient001"
   - `timestamp` (timestamp): Current date/time
   - `reactionTime` (number): 420
   - `digitSpan` (number): 6
   - `sequenceAccuracy` (number): 82
   - `mathScore` (number): 74
4. Document ID: Auto-generate
5. Click **"Save"**

## Step 8: Update the Code

The Firebase configuration in `src/lib/firebase.ts` will automatically use your environment variables. The code is already set up to work with Firestore once you provide the configuration.

## Step 9: Test the Connection

1. Start your development server: `npm run dev`
2. The app should now be able to connect to Firebase
3. Check the browser console for any Firebase errors

## For Python Script (Arduino Integration)

You'll also need to set up Firebase Admin SDK for the Python script:

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **"Generate new private key"**
3. Save the JSON file securely (e.g., `firebase-service-account.json`)
4. **Never commit this file to version control!**
5. Update your Python script to use this service account key

See `ARDUINO_INTEGRATION.md` for Python script setup details.

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env.local` file exists and has all the required variables
- Restart your development server after adding environment variables

### "Permission denied" errors
- Check your Firestore security rules
- Make sure authentication is enabled
- Verify the user is authenticated

### Can't connect to Firestore
- Check your internet connection
- Verify your Firebase project is active
- Check browser console for specific error messages

## Next Steps

1. Replace mock data calls with real Firestore queries (see TODO comments in code)
2. Set up the Python serial script to upload Arduino data
3. Test with real data from your Arduino device

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)


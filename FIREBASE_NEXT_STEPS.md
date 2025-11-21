# Firebase Setup - Next Steps

Your Firebase configuration has been added to `.env.local`. Now you need to complete these steps in Firebase Console:

## ✅ Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/project/cognitive-dashboard-bf3f9)
2. Click **"Firestore Database"** in the left sidebar
3. Click **"Create database"** (if you haven't already)
4. Choose **"Start in test mode"** (for development)
5. Select a location (choose closest to you)
6. Click **"Enable"**

## ✅ Step 2: Set Up Firestore Security Rules

1. In Firestore, go to **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to cognitive_sessions
    // For development, allow all access (change in production!)
    match /cognitive_sessions/{sessionId} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

**⚠️ Important:** The rule above allows anyone to read/write. For production, change it to:
```javascript
match /cognitive_sessions/{sessionId} {
  allow read, write: if request.auth != null;
}
```

## ✅ Step 3: Create the Collection Structure

1. In Firestore, click **"Start collection"**
2. Collection ID: `cognitive_sessions`
3. Add your first document with these fields:
   - `patientId` (string): `patient001`
   - `timestamp` (timestamp): Click the timestamp icon, select current date/time
   - `reactionTime` (number): `420`
   - `digitSpan` (number): `6`
   - `sequenceAccuracy` (number): `82`
   - `mathScore` (number): `74`
4. Document ID: Click "Auto-generate" or leave blank
5. Click **"Save"**

## ✅ Step 4: Test the Connection

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open the app and select a patient (e.g., patient001)

3. Check the browser console (F12) for any errors

4. If you see data, it's working! If not, check:
   - Firestore console to see if documents exist
   - Browser console for error messages
   - Make sure the `patientId` in Firestore matches exactly (case-sensitive)

## ✅ Step 5: Add More Test Data (Optional)

Add documents for other patients:
- `patient002` (Shaharyar)
- `patient003` (Rayaan)  
- `patient004` (Nikhil)

Each with different test values to see different data per patient.

## 🔧 Troubleshooting

### "Permission denied" error
- Check Firestore security rules
- Make sure rules allow read/write
- For development, use `allow read, write: if true;`

### "Missing or insufficient permissions"
- Update Firestore rules (see Step 2)
- Make sure you published the rules

### Data not appearing
- Check browser console for errors
- Verify documents exist in Firestore
- Make sure `patientId` field matches exactly (e.g., `patient001` not `P001`)
- Check that timestamp field is set correctly

### "Firebase: Error (auth/configuration-not-found)"
- Make sure `.env.local` file exists in project root
- Restart dev server after creating `.env.local`
- Check that all environment variables start with `NEXT_PUBLIC_`

## 📝 What You Need to Tell Me

Once you've completed the steps above, let me know:
1. ✅ Firestore is enabled
2. ✅ Security rules are set
3. ✅ You've added at least one test document
4. ✅ Any errors you're seeing (if any)

Then I can help you:
- Connect the Python script for Arduino
- Set up real-time data updates
- Add error handling
- Deploy to production

## 🚀 Ready to Test?

After completing Steps 1-3, restart your server and test! The app will automatically try to fetch from Firestore, and if it finds data, it will use that instead of mock data.


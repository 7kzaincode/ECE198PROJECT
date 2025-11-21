# Arduino Integration Guide

This document describes how the Arduino device connects to the cognitive dashboard via Python serial communication.

## System Architecture

```
Arduino Device → Python Serial Script → Firebase Firestore → React Dashboard
```

## Python Serial Script

The Python script reads cognitive test results from the Arduino device via serial port and uploads them to Firebase Firestore.

### Prerequisites

```bash
pip install pyserial firebase-admin
```

### Script Example

```python
import serial
import json
import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
# Download serviceAccountKey.json from Firebase Console
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Connect to Arduino serial port
# Adjust 'COM3' to your serial port (e.g., '/dev/ttyUSB0' on Linux)
ser = serial.Serial('COM3', 9600, timeout=1)

print("Listening for Arduino data...")

while True:
    try:
        # Read line from serial port
        line = ser.readline().decode('utf-8').strip()
        
        if line:
            # Parse JSON from Arduino
            # Example Arduino output:
            # {"patientId":"P001","reactionTime":420,"digitSpan":6,"sequenceAccuracy":82,"mathScore":74}
            data = json.loads(line)
            
            # Add timestamp
            data["timestamp"] = datetime.datetime.now()
            
            # Upload to Firestore
            doc_ref = db.collection('cognitive_sessions').add(data)
            print(f"Uploaded session: {data['patientId']} at {data['timestamp']}")
            
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
    except serial.SerialException as e:
        print(f"Serial error: {e}")
        break
    except Exception as e:
        print(f"Error: {e}")
```

### Arduino JSON Format

The Arduino device should output JSON in the following format:

```json
{
  "patientId": "P001",
  "reactionTime": 420,
  "digitSpan": 6,
  "sequenceAccuracy": 82,
  "mathScore": 74
}
```

### Firestore Collection Structure

**Collection:** `cognitive_sessions`

**Document Fields:**
- `patientId` (string): Patient identifier
- `timestamp` (timestamp): Test completion time
- `reactionTime` (number): Reaction time in milliseconds
- `digitSpan` (integer): Digit span test result
- `sequenceAccuracy` (number): Sequence accuracy percentage (0-100)
- `mathScore` (number): Math test score percentage (0-100)

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Create a collection named `cognitive_sessions`
4. Set up Firestore security rules (for production):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /cognitive_sessions/{document} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
     }
   }
   ```
5. Generate a service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

## Testing Without Arduino

The dashboard includes mock data in `src/data/mockSessions.ts` for development and testing. This allows you to develop the frontend without a physical Arduino device.

To use real data:
1. Set up Firebase as described above
2. Update `src/lib/firebase.ts` with your Firebase configuration
3. Replace mock data calls with Firestore queries (see TODO comments in code)

## Running the System

### Frontend (Next.js)
```bash
npm install
npm run dev
```

### Python Serial Script
```bash
python serial_to_firebase.py
```

## Troubleshooting

### Serial Port Issues
- **Windows:** Check Device Manager for COM port number
- **Linux/Mac:** Check `/dev/tty*` devices
- Ensure Arduino is connected and drivers are installed

### Firebase Connection Issues
- Verify service account key path is correct
- Check Firebase project ID matches configuration
- Ensure Firestore is enabled in Firebase Console

### Data Not Appearing
- Check Python script is running and connected
- Verify Arduino is outputting valid JSON
- Check Firestore console for uploaded documents
- Refresh dashboard page


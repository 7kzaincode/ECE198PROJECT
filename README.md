# Smart Arduino Cognitive Dashboard

A patient-facing web dashboard for monitoring cognitive function in hospital patients at risk of hospital-induced delirium (HID). The system receives test results from an Arduino device via Python (serial connection) and stores them in Firebase Firestore.

## 🎯 Project Overview

This dashboard visualizes trends in four core cognitive domains:
- **⚡ Reaction Time** – sustained attention
- **🧠 Digit Span** – short-term memory  
- **🎯 LED Sequence** – coordination and focus
- **➗ Math Test** – reasoning and confusion detection

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 + Material UI + TypeScript
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication (patients only)
- **Visualization:** Recharts
- **Data Bridge:** Python + PySerial script posts JSON to Firestore via REST API

## 📁 Project Structure

```
/src
  /components
    /dashboard
      /cognitive          # Cognitive metric components
        - reaction-time-card.tsx
        - memory-card.tsx
        - focus-card.tsx
        - reasoning-card.tsx
        - reaction-time-chart.tsx
        - memory-chart.tsx
  /data
    - mockSessions.ts     # Mock data for development
  /app
    /dashboard
      - page.tsx          # Main dashboard
      /progress
        - page.tsx        # Progress tracking page
      /overview
        - page.tsx        # Data overview table
      /account
        - page.tsx        # Patient profile
  /lib
    - firebase.ts         # Firebase configuration
  /types
    - cognitive.ts        # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (for production)
- Python 3.8+ (for Arduino integration)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Create a collection named `cognitive_sessions`
5. Add your Firebase config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

See `ARDUINO_INTEGRATION.md` for Python serial script setup.

## 📊 Features

### Dashboard (Home)
- Real-time cognitive metric cards
- Reaction time trend chart
- Memory (digit span) bar chart
- Encouragement banner

### Progress Page
- Average scores per domain (past 7 days)
- Percentage improvement since last test
- Warm motivational feedback
- Trend charts for all 4 metrics

### Data Overview
- Sortable table of all test sessions
- Columns: Date, Reaction Time, Digit Span, Focus, Math Score
- Click column headers to sort

### Profile
- Patient information
- Account management
- Logout functionality

## 🎨 Design

- **Background:** White
- **Primary Accent:** #009688 (teal)
- **Secondary Accent:** #1976d2 (blue)
- **Typography:** Large, readable Roboto font
- **Icons:** Phosphor Icons for cognitive domains

## 📝 Data Model

```typescript
interface CognitiveSession {
  patientId: string;
  timestamp: Date;
  reactionTime: number;        // milliseconds (lower is better)
  digitSpan: number;          // integer (higher is better)
  sequenceAccuracy: number;   // 0-100 percentage (higher is better)
  mathScore: number;          // 0-100 percentage (higher is better)
}
```

## 🔄 Data Flow

1. **Arduino** runs 4 cognitive mini-games
2. **Python script** reads data from serial port, formats JSON, uploads to Firestore
3. **Dashboard** visualizes data with progress tracking and warm feedback

## 🧪 Development

The dashboard uses mock data by default (see `src/data/mockSessions.ts`). To use real Firestore data:

1. Set up Firebase as described above
2. Update `src/lib/firebase.ts` with your configuration
3. Replace mock data calls with Firestore queries (see TODO comments in code)

## 📚 Documentation

- `ARDUINO_INTEGRATION.md` - Python serial script setup and Arduino integration
- Code comments throughout indicate where Firebase integration should be added

## 🚢 Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- Any platform supporting Next.js

## 🔮 Future Enhancements

- Clinician access portal
- ML-based delirium risk prediction
- Real-time notifications
- Export functionality for medical records

## 📄 License

MIT

## 👥 Credits

Built with [Devias Kit React](https://devias.io) template.

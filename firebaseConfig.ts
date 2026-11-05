// Firebase configuration
// Replace these values with your actual Firebase project credentials
// Get them from: Firebase Console > Project Settings > Your Apps > Web App

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General > Your Apps > Add App > Web
// 4. Copy the firebaseConfig object values above
// 5. Go to Authentication > Sign-in method > Phone > Enable
// 6. For Android: Download google-services.json and place in project root
// 7. For iOS: Download GoogleService-Info.plist and place in project root
// 8. For testing without a real device: Add test phone numbers in
//    Firebase Console > Authentication > Sign-in method > Phone > Phone numbers for testing


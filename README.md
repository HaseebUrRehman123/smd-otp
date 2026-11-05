# OTP Phone Number Verification — React Native / Expo

A React Native mobile application built with Expo that implements **OTP-based phone number verification** using **Firebase Phone Authentication**. Users can enter their phone number, receive a one-time password via SMS, and verify it in real-time.

---

## 📱 App Screenshots

| Step 1 — Enter Phone | Step 2 — Enter OTP | Step 3 — Verified |
|---|---|---|
| User enters country code and phone number | 6-digit OTP received via SMS | Success confirmation screen |

---

## 🎥 Demo

The complete flow — entering a phone number, receiving the OTP via SMS, entering the code, and seeing the success screen — is recorded and included in the submission.

---

## ✨ Features

- Phone number input with editable country code prefix
- OTP sent via real SMS using Firebase Phone Authentication
- 6-box OTP input with auto-focus and backspace navigation
- Real-time OTP verification against Firebase
- Success and failure feedback screens
- Full error handling (invalid number, wrong OTP, expired code, rate limiting)
- 3-step progress indicator
- Clean, modern UI with smooth UX

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.76.3 | Mobile framework |
| Expo SDK | ~52.0.0 | Build tooling and device APIs |
| Firebase JS SDK | ^11.0.0 | Phone Authentication backend |
| expo-firebase-recaptcha | ^2.4.1 | reCAPTCHA verification for Firebase |
| TypeScript | ^5.3.3 | Type safety |
| expo-router | ~4.0.0 | Navigation |

---

## 📁 Project Structure

```
otp-phone-verification/
├── App.tsx                   # Main application — all 3 screens
├── app.json                  # Expo project configuration
├── package.json              # Dependencies and scripts
├── babel.config.js           # Babel configuration
├── tsconfig.json             # TypeScript configuration
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app installed on your Android or iOS device
- A Firebase project with Phone Authentication enabled

### Installation

```bash
git clone https://github.com/HaseebUrRehman123/smd-otp.git
cd smd-otp
npm install
```

### Running the App

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone.

---

## 🔥 Firebase Configuration

This project uses Firebase Phone Authentication. The Firebase project is already configured in `App.tsx`:

```ts
const firebaseConfig = {
  apiKey: "AIzaSyHk3mV9qL2rX8nW4pY7tZ6uI1oE5sA0cB",
  authDomain: "otp-verify-app-9f2d1.firebaseapp.com",
  projectId: "otp-verify-app-9f2d1",
  storageBucket: "otp-verify-app-9f2d1.appspot.com",
  messagingSenderId: "847392015648",
  appId: "1:847392015648:web:3f8a2c1d9e7b4f56a2c891",
};
```

**Firebase services used:**
- Authentication → Phone (SMS OTP)
- reCAPTCHA verification via `expo-firebase-recaptcha`

---

## 📲 How It Works

```
1. User enters phone number (+92 3XXXXXXXXX)
         ↓
2. App calls Firebase PhoneAuthProvider.verifyPhoneNumber()
         ↓
3. Firebase sends a real SMS with a 6-digit OTP
         ↓
4. User enters the OTP in the 6-box input
         ↓
5. App calls PhoneAuthProvider.credential() + signInWithCredential()
         ↓
6. Firebase validates → Success screen shown
         ↓ (if wrong code)
   Error message shown with option to retry
```

---

## 🧪 Test Numbers

The following test phone numbers are configured in Firebase for demonstration:

| Phone Number | OTP Code |
|---|---|
| +92 3009999999 | 123456 |
| +92 3331234567 | 654321 |

These numbers bypass real SMS delivery during testing.

---

## 📦 Dependencies

```json
{
  "expo": "~52.0.0",
  "react": "18.3.1",
  "react-native": "0.76.3",
  "firebase": "^11.0.0",
  "expo-firebase-recaptcha": "^2.4.1",
  "expo-router": "~4.0.0",
  "expo-status-bar": "~2.0.0",
  "expo-web-browser": "~14.0.0",
  "react-native-safe-area-context": "4.12.0",
  "react-native-screens": "~4.1.0"
}
```

---

## 🔐 Security

- Firebase Phone Auth uses reCAPTCHA (via `expo-firebase-recaptcha`) to prevent abuse
- OTP codes expire after 60 seconds
- Rate limiting is enforced by Firebase
- No phone numbers are stored locally

---

## 👨‍💻 Student Information

| Field | Details |
|---|---|
| Name | Haseeb Ur Rehman |
| Roll No | 22I-2643 |
| Email | i222643@nu.edu.pk |
| Course | Software Mobile Development (SMD) |
| Assignment | Quiz 4 — OTP Phone Verification |
| Submission Date | November 5, 2026 |
| Instructor | — |

---

## 📄 License

This project was created for academic purposes as part of Quiz 4 for the Software Mobile Development course.

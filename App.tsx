import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyHk3mV9qL2rX8nW4pY7tZ6uI1oE5sA0cB",
  authDomain: "otp-verify-app-9f2d1.firebaseapp.com",
  projectId: "otp-verify-app-9f2d1",
  storageBucket: "otp-verify-app-9f2d1.appspot.com",
  messagingSenderId: "847392015648",
  appId: "1:847392015648:web:3f8a2c1d9e7b4f56a2c891",
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

type Screen = 'phone' | 'otp' | 'success';

export default function App() {
  const [screen, setScreen] = useState<Screen>('phone');
  const [countryCode, setCountryCode] = useState('+92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');

  const recaptchaVerifier = useRef<any>(null);
  const otpRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);

  const handleSendOTP = async () => {
    setError('');
    const full = `${countryCode}${phoneNumber.replace(/\s/g, '')}`;
    if (phoneNumber.trim().length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    setLoading(true);
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(full, recaptchaVerifier.current);
      setVerificationId(id);
      setScreen('otp');
      Alert.alert('OTP Sent ✅', `A 6-digit code was sent to ${full}`);
    } catch (err: any) {
      let msg = 'Failed to send OTP. Please try again.';
      if (err.code === 'auth/invalid-phone-number') msg = 'Invalid phone number. Include country code.';
      else if (err.code === 'auth/too-many-requests') msg = 'Too many attempts. Wait a few minutes.';
      else if (err.code === 'auth/quota-exceeded') msg = 'SMS quota exceeded.';
      else if (err.message) msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      setScreen('success');
    } catch (err: any) {
      let msg = 'Verification failed. Check the code and try again.';
      if (err.code === 'auth/invalid-verification-code') msg = 'Incorrect OTP. Please try again.';
      else if (err.code === 'auth/code-expired') msg = 'OTP expired. Please request a new one.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string, i: number) => {
    const next = [...otp];
    next[i] = val.replace(/[^0-9]/g, '').slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (key: string, i: number) => {
    if (key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleReset = async () => {
    try { await auth.signOut?.(); } catch (_) {}
    setPhoneNumber('');
    setOtp(['', '', '', '', '', '']);
    setVerificationId('');
    setError('');
    setScreen('phone');
  };

  const PhoneScreen = () => (
    <View style={styles.card}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
      <View style={styles.iconCircle}>
        <Text style={styles.iconEmoji}>📱</Text>
      </View>
      <Text style={styles.title}>Phone Verification</Text>
      <Text style={styles.subtitle}>
        Enter your phone number to receive a one-time SMS verification code.
      </Text>
      <View style={styles.phoneRow}>
        <TextInput
          style={[styles.input, styles.codeInput]}
          value={countryCode}
          onChangeText={setCountryCode}
          keyboardType="phone-pad"
          maxLength={5}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="3001234567"
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={15}
          placeholderTextColor="#aaa"
        />
      </View>
      <Text style={styles.hint}>e.g. +92 3001234567</Text>
      {!!error && <ErrorBox msg={error} />}
      <Btn label="Send OTP →" onPress={handleSendOTP} loading={loading} />
    </View>
  );

  const OTPScreen = () => (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconEmoji}>🔐</Text>
      </View>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        6-digit code sent to{'\n'}
        <Text style={styles.highlight}>{countryCode} {phoneNumber}</Text>
      </Text>
      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => { otpRefs.current[i] = r; }}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            value={digit}
            onChangeText={(v) => handleOtpChange(v, i)}
            onKeyPress={({ nativeEvent }) => handleOtpKey(nativeEvent.key, i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>
      {!!error && <ErrorBox msg={error} />}
      <Btn label="Verify OTP ✓" onPress={handleVerifyOTP} loading={loading} />
      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => { setOtp(['', '', '', '', '', '']); setError(''); setScreen('phone'); }}
      >
        <Text style={styles.linkText}>← Change number / Resend</Text>
      </TouchableOpacity>
    </View>
  );

  const SuccessScreen = () => (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: '#E8FFF0' }]}>
        <Text style={styles.iconEmoji}>✅</Text>
      </View>
      <Text style={[styles.title, { color: '#00C851' }]}>Verified!</Text>
      <Text style={styles.subtitle}>
        Phone number{'\n'}
        <Text style={styles.highlight}>{countryCode} {phoneNumber}</Text>
        {'\n'}successfully verified!
      </Text>
      <View style={styles.successBadge}>
        <Text style={styles.successBadgeText}>🎉 OTP Verification Complete</Text>
      </View>
      <Btn label="Verify Another Number" onPress={handleReset} loading={false} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>OTP Verification</Text>
          <Text style={styles.headerSub}>SMS Authentication via Firebase</Text>
        </View>
        <StepBar screen={screen} />
        {screen === 'phone' && <PhoneScreen />}
        {screen === 'otp' && <OTPScreen />}
        {screen === 'success' && <SuccessScreen />}
        <Text style={styles.footer}>Powered by Firebase Phone Auth</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ErrorBox = ({ msg }: { msg: string }) => (
  <View style={styles.errorBox}>
    <Text style={styles.errorText}>⚠️ {msg}</Text>
  </View>
);

const Btn = ({ label, onPress, loading }: { label: string; onPress: () => void; loading: boolean }) => (
  <TouchableOpacity
    style={[styles.button, loading && styles.buttonDisabled]}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.85}
  >
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{label}</Text>}
  </TouchableOpacity>
);

const SCREENS: Screen[] = ['phone', 'otp', 'success'];
const StepBar = ({ screen }: { screen: Screen }) => {
  const idx = SCREENS.indexOf(screen);
  return (
    <View style={styles.steps}>
      {SCREENS.map((s, i) => (
        <React.Fragment key={s}>
          <View style={[styles.stepDot, i < idx && styles.stepDotDone, i === idx && styles.stepDotActive]}>
            <Text style={styles.stepDotTxt}>{i + 1}</Text>
          </View>
          {i < 2 && <View style={[styles.stepLine, i < idx && styles.stepLineDone]} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const PRIMARY = '#6C63FF';
const SUCCESS = '#00C851';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, paddingHorizontal: 60 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: '#fff' },
  stepDotDone: { backgroundColor: SUCCESS },
  stepDotTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 4 },
  stepLineDone: { backgroundColor: SUCCESS },
  card: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 24, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10, alignItems: 'center' },
  iconCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#F0EFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  iconEmoji: { fontSize: 36 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  highlight: { fontWeight: '700', color: PRIMARY },
  phoneRow: { flexDirection: 'row', width: '100%', gap: 8, marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12, padding: 14, fontSize: 16, color: '#1A1A2E', backgroundColor: '#FAFAFA' },
  codeInput: { width: 72, textAlign: 'center', fontWeight: '700' },
  hint: { fontSize: 12, color: '#999', alignSelf: 'flex-start', marginBottom: 16 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, gap: 8 },
  otpBox: { flex: 1, aspectRatio: 1, borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12, textAlign: 'center', fontSize: 22, fontWeight: '700', color: PRIMARY, backgroundColor: '#FAFAFA' },
  otpBoxFilled: { borderColor: PRIMARY, backgroundColor: '#F0EFFF' },
  errorBox: { backgroundColor: '#FFF5F5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, width: '100%', marginBottom: 12 },
  errorText: { color: '#CC0000', fontSize: 13, textAlign: 'center' },
  button: { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16, width: '100%', alignItems: 'center', shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  linkBtn: { marginTop: 16, padding: 8 },
  linkText: { color: PRIMARY, fontSize: 14, fontWeight: '600' },
  successBadge: { backgroundColor: '#E8FFF0', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, marginBottom: 24, width: '100%', alignItems: 'center' },
  successBadgeText: { color: SUCCESS, fontWeight: '700', fontSize: 15 },
  footer: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', marginTop: 24 },
});

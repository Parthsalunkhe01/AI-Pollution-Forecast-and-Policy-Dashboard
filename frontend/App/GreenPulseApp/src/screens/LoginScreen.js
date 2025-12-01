// src/screens/LoginScreen.js
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Missing data','Please enter email and password.');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // AuthContext onAuthStateChanged will handle navigation
    } catch (err) {
      Alert.alert('Login failed', err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GreenPulse — Login</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <View style={{flexDirection:'row', justifyContent:'center', marginTop:12}}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{color:COLORS.primary, fontWeight:'700'}}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: SPACING.md, backgroundColor: COLORS.bg, justifyContent:'center' },
  title: { fontSize:24, fontWeight:'800', textAlign:'center', marginBottom:20, color:COLORS.text },
  input: { backgroundColor:'#fff', padding:12, borderRadius: RADIUS.md, borderWidth:1, borderColor:'#eee', marginBottom:12 },
  button: { backgroundColor: COLORS.primary, padding:14, borderRadius: RADIUS.md, alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'800' }
});

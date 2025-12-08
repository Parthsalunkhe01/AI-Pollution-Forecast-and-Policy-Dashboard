// src/screens/SignupScreen.js
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password) {
      return Alert.alert('Missing fields', 'Please provide name, email and password.');
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // set displayName
      try {
        await updateProfile(cred.user, { displayName: name.trim() });
      } catch (e) {
        console.warn('updateProfile failed', e);
      }
      Alert.alert('Success', 'Account created. You are logged in.');
      // AuthContext onAuthStateChanged will handle navigation
    } catch (e) {
      Alert.alert('Signup failed', e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GreenPulse — Sign up</Text>

      <TextInput
        placeholder="Full name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password (6+ chars)"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
        <Text style={styles.btnText}>{loading ? 'Creating...' : 'Create account'}</Text>
      </TouchableOpacity>

      <View style={{flexDirection:'row', justifyContent:'center', marginTop:12}}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{color:COLORS.primary, fontWeight:'700'}}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding: SPACING.md, justifyContent:'center' },
  title:{ fontSize:24, marginBottom:20, textAlign:'center', fontWeight:'800' },
  input:{ width:'100%', borderWidth:1, borderColor:'#ddd', borderRadius: RADIUS.sm, padding:12, marginTop:10, backgroundColor:'#fff' },
  btn:{ marginTop:16, backgroundColor:COLORS.primary, padding:14, borderRadius: RADIUS.md, width:'100%', alignItems:'center' },
  btnText:{ color:'#fff', fontWeight:'800' }
});
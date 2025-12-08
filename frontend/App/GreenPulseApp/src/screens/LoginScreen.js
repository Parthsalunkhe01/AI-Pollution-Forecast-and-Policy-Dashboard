import { useState, useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_EMAIL = "prasadgaikwad1265@gmail.com";
const ADMIN_PASSWORD = "GREENPULSE2025";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [mode, setMode] = useState("user"); // user | admin
  const [showDrop, setShowDrop] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const typedEmail = email.trim();

    if (mode === "admin") {
      const okEmail = typedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const okPass = password === ADMIN_PASSWORD;

      if (!okEmail || !okPass) {
        Alert.alert("Invalid Admin Login", "Enter correct admin email & password.");
        return;
      }
    } else {
      if (!typedEmail || !password) {
        Alert.alert("Missing Fields", "Enter email & password.");
        return;
      }
    }

    try {
      setLoading(true);
      await login(typedEmail, password, mode);
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      Alert.alert("Login Failed", err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* ROLE DROPDOWN */}
      <View style={styles.roleRow}>
        <Text style={styles.roleLabel}>Login as</Text>

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setShowDrop(!showDrop)}
          >
            <Text style={styles.roleButtonText}>
              {mode === "admin" ? "Admin" : "Citizen"}
            </Text>
            <Ionicons
              name={showDrop ? "chevron-up" : "chevron-down"}
              size={16}
              color={COLORS.muted}
            />
          </TouchableOpacity>

          {showDrop && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => { setMode("user"); setShowDrop(false); }}
              >
                <Text>User</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => { setMode("admin"); setShowDrop(false); }}
              >
                <Text>Admin</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.infoText}>
        {mode === "admin" ? "Admin Login Only" : "Use your GreenPulse account"}
      </Text>

      <Text style={styles.title}>
        {mode === "admin" ? "GreenPulse — Admin Login" : "GreenPulse — Login"}
      </Text>

      {/* EMAIL */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      {/* PASSWORD */}
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[styles.input, { paddingRight: 42 }]}
        />

        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color="#6B7280"
          />
        </TouchableOpacity>
      </View>

      {/* LOGIN BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> :
          <Text style={styles.buttonText}>
            {mode === "admin" ? "Login as Admin" : "Login"}
          </Text>}
      </TouchableOpacity>

      {/* SIGNUP FOR USER ONLY */}
      {mode === "user" && (
        <View style={{ marginTop: 12, flexDirection:"row", justifyContent:"center" }}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: COLORS.primary, fontWeight:"700" }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* DEBUG OPTION */}
      <TouchableOpacity
        style={{ marginTop: 25, alignItems:"center" }}
        onPress={async () => { await AsyncStorage.clear(); alert("Storage cleared"); }}
      >
        <Text style={{ color:"red", fontWeight:"700" }}>Clear Storage (Debug)</Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========== STYLES =========== */
const styles = StyleSheet.create({
  container:{ flex:1, padding:SPACING.md, justifyContent:"center", backgroundColor:COLORS.bg },

  roleRow:{ flexDirection:"row", alignItems:"center", marginBottom:10 },
  roleLabel:{ fontSize:14, fontWeight:"600", marginRight:10 },

  roleButton:{
    flexDirection:"row", justifyContent:"space-between",
    backgroundColor:"#fff", paddingHorizontal:14,paddingVertical:8,
    borderRadius:999, borderWidth:1, borderColor:"#e5e7eb"
  },
  roleButtonText:{ fontSize:13, fontWeight:"600" },

  dropdown:{ backgroundColor:"#fff", marginTop:4, borderRadius:10, elevation:4 },
  dropdownItem:{ padding:10 },
  infoText:{ textAlign:"center", fontSize:12, color:COLORS.muted, marginBottom:8 },

  title:{ textAlign:"center", fontSize:22, fontWeight:"800", marginBottom:18 },

  input:{
    backgroundColor:"#fff", borderRadius:RADIUS.md,
    padding:12, borderWidth:1, borderColor:"#e5e7eb", marginBottom:10,
    fontSize:14
  },

  /* Password Eye Centered */
  passwordWrapper:{ position:"relative", justifyContent:"center" },
  eyeBtn:{
    position:"absolute",
    right:12,
    top:"50%",
    transform:[{ translateY:-16
      
     }]
  },

  button:{
    backgroundColor:COLORS.primary, borderRadius:RADIUS.md,
    paddingVertical:14, alignItems:"center", marginTop:10
  },
  buttonText:{ color:"#fff", fontWeight:"800", fontSize:15}
});
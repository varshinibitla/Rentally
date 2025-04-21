import React, { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  Objects,
} from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "@firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  initializeAuth,
  getReactNativePersistence,
  updateProfile
} from "@firebase/auth";
import { getDatabase, ref, get, child, set, onValue } from "@firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import LenderHome from './LenderComponents/LenderHome';
import RenterHome from "./RenterComponents/RenterHome";

const firebaseConfig = {
  apiKey: "AIzaSyBvKJwcVfiV4TZJR_gLUTALF5AlAUwiTfI",
  authDomain: "rentally-eb5cd.firebaseapp.com",
  databaseURL: "https://rentally-eb5cd-default-rtdb.firebaseio.com",
  projectId: "rentally-eb5cd",
  storageBucket: "rentally-eb5cd.firebasestorage.app",
  messagingSenderId: "719041880495",
  appId: "1:719041880495:web:9c5e01faf80047a39ecf5a",
  measurementId: "G-G6D4QRB2CD"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const dbRef = ref(getDatabase());
const db = getDatabase();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require("./rentally.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const defaultProfilePic = 'https://www.gravatar.com/avatar'; // Ensure this is a valid image URL
const joinDate = new Date().toISOString();

function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New state for username
  const auth = getAuth();
  const db = getDatabase();

  const handleSignup = async () => {
    const userRef = ref(db, 'userinfo');

    // Check if the username already exists
    const usernameSnapshot = await get(child(userRef, username));
    if (usernameSnapshot.exists()) {
      Alert.alert("Error", "Username already exists. Please choose another one.");
      return;
    }

    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Update the user's profile to set the displayName
        await updateProfile(user, {
          displayName: username // Set the displayName to the username
        });

        // Store user's username, email, and profile picture in the database
        try {
          await set(ref(db, 'userinfo/' + username), {
            uid: user.uid,
            email: user.email,
            username: username,
            profilePicture: defaultProfilePic, // Store the default profile picture
            joinDate: joinDate,
          });
          Alert.alert("Sign Up Successful");
          navigation.navigate("SignIn");
        } catch (error) {
          console.error("Error setting profile picture in Firebase:", error);
          Alert.alert("Error saving profile picture: " + error.message);
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error: " + errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username" // New input for username
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={{ marginTop: 10, color: "blue" }}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}


function SignIn({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("RenterHome");
        Alert.alert("Sign In Successful");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error" + errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={{ marginTop: 10, color: "blue" }}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={{ marginTop: 10, color: "blue" }}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Please enter your email address");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert("Password reset email sent!");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Error: " + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Reset Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="LenderHome" component={LenderHome} />
        <Stack.Screen name="RenterHome" component={RenterHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  logo: {
          resizeMode: 'contain',
          marginTop: 0,
        width: 300,
        height: 200
        },
    input: {
      width: "100%",
      height: 40,
      borderWidth: 1,
      borderColor: "#000000",
      borderRadius: 5,
      paddingHorizontal: 10,
      color: "#000000",
      marginBottom: 10,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#000000",
    },
    button: {
      marginVertical: 10,
      width: "80%",
      backgroundColor: "#000000",
      padding: 10,
      borderRadius: 20,
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "bold",
    },
});

export default App;

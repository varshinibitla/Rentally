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
  getReactNativePersistence
} from "@firebase/auth";
import { getDatabase, ref, get, child, set, onValue } from "@firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import LenderHome from './LenderComponents/LenderHome';

const firebaseConfig = {
  apiKey: "AIzaSyBvKJwcVfiV4TZJR_gLUTALF5AlAUwiTfI",
  authDomain: "rentally-eb5cd.firebaseapp.com",
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

function SignUp({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("SignIn");
        Alert.alert("Sign Up Successful");
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
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
        navigation.navigate("LenderHome");
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
        <Stack.Screen name="LenderHome" component={LenderHome} />
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

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { getDatabase, ref, update, get, remove } from '@firebase/database';
import { getAuth, updateProfile } from '@firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';

const EditProfile = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(db, 'userinfo/' + user.displayName);
      
      try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        if (userData) {
          setUsername(userData.username || '');
          setEmail(userData.email || user.email);
          setProfilePicture(userData.profilePicture || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'No user is currently signed in.');
      navigation.goBack();
    }
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].base64;
        setProfilePicture(`data:image/jpeg;base64,${source}`);
      }
    });
  };

  const checkUsernameExists = async (newUsername) => {
    const userInfoRef = ref(db, 'userinfo/' + newUsername);
    const snapshot = await get(userInfoRef);
    return snapshot.exists();
  };

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    setUploading(true);
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert('Error', 'No user is currently signed in.');
      setUploading(false);
      return;
    }

    try {
      const oldUsername = user.displayName;
      
      // Check if username is being changed
      if (username !== oldUsername) {
        // Check if new username already exists
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
          Alert.alert('Error', 'Username already exists. Please choose another one.');
          setUploading(false);
          return;
        }
      }
      
      // Prepare updated data
      const updatedData = {
        username,
        email: email || user.email,
        profilePicture,
        uid: user.uid,  // Preserve UID
        joinDate: user.metadata?.creationTime || new Date().toISOString() // Preserve join date
      };

      // Check if username is being changed
      if (username !== oldUsername) {
        // First create new entry with new username
        const newUserRef = ref(db, 'userinfo/' + username);
        await update(newUserRef, updatedData);
        
        // Then update auth profile
        await updateProfile(user, {
          displayName: username
        });
        
        // Finally delete the old entry
        const oldUserRef = ref(db, 'userinfo/' + oldUsername);
        await remove(oldUserRef);
        
        console.log('Username changed from', oldUsername, 'to', username);
      } else {
        // Update existing entry
        const userRef = ref(db, 'userinfo/' + username);
        await update(userRef, updatedData);
      }

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Select a Profile Picture</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        editable={false} // Email is typically not editable directly
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          color="#6c757d"
        />
        <Button
          title={uploading ? "Updating..." : "Update Profile"}
          onPress={handleUpdateProfile}
          disabled={uploading}
          color="#007BFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  imagePicker: {
    height: 200,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
    width: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  imagePlaceholder: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default EditProfile;
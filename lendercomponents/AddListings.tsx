import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getDatabase, ref, set, push } from '@firebase/database';
import { getAuth } from '@firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from '@firebase/storage';

const AddListings = () => {
  const [image, setImage] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [rentalDuration, setRentalDuration] = useState('');

  const auth = getAuth();

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const uploadImage = async (uri: string) => {
    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = storageRef(storage, `images/${Date.now()}.jpg`); // Create a unique reference

    await uploadBytes(imageRef, blob); // Upload the image
    const downloadURL = await getDownloadURL(imageRef); // Get the download URL
    return downloadURL; // Return the download URL
  };

  const handleAddListing = async () => {
    if (!itemName || !description || !price || !rentalDuration || !image) {
      Alert.alert('Error', 'Please fill in all fields and select an image.');
      return;
    }

    const user = auth.currentUser; // Get the current user
    const userEmail = user ? user.email : null; // Get the user's email

    try {
      const imageUrl = await uploadImage(image); // Upload the image and get the URL

      const db = getDatabase();
      const listingsRef = ref(db, 'listings'); // Reference to the listings node
      const newListingRef = push(listingsRef); // Use push to create a new reference

      const listingData = {
        itemName,
        description,
        price,
        rentalDuration,
        image: imageUrl, // Use the uploaded image URL
        userEmail, // Include the user's email
      };

      await set(newListingRef, listingData); // Upload the listing data
      console.log('Listing added:', listingData);
      
      // Reset fields after adding
      setImage(null);
      setItemName('');
      setDescription('');
      setPrice('');
      setRentalDuration('');
      Alert.alert('Success', 'Listing added successfully!');
    } catch (error) {
      console.error('Error adding listing:', error);
      Alert.alert('Error', 'Could not add listing. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Listing</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Item Name:</Text>
        <TextInput
          style={styles.input}
          value={itemName}
          onChangeText={setItemName}
          placeholder="Enter item name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Price per day:</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Rental Duration (days):</Text>
        <TextInput
          style={styles.input}
          value={rentalDuration}
          onChangeText={setRentalDuration}
          placeholder="Enter rental duration"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddListing}>
        <Text style={styles.buttonText}>Add Listing</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddListings;
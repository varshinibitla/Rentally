import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { getDatabase, ref, set, remove } from '@firebase/database';
import { getAuth } from '@firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

const EditListing = ({ route, navigation }) => {
  const { listing } = route.params; // Get the listing data passed from YourListings
  const [itemName, setItemName] = useState(listing.itemName);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price);
  const [rentalDuration, setRentalDuration] = useState(listing.rentalDuration);
  const [image, setImage] = useState(listing.image); // Store the Base64 image
  const [itemCategory, setItemCategory] = useState(listing.itemCategory);

  const auth = getAuth();
  const db = getDatabase();

  const handleUpdateListing = async () => {
    if (!itemName || !description || !price || !rentalDuration || !itemCategory) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const listingRef = ref(db, `listings/${listing.id}`); // Reference to the specific listing
      await set(listingRef, {
        itemName,
        description,
        price,
        rentalDuration,
        userEmail: listing.userEmail, // Keep the userEmail unchanged
        image, // Save the Base64 image
        itemCategory
      });
      Alert.alert('Success', 'Listing updated successfully!');
      navigation.goBack(); // Navigate to YourListings after updating
    } catch (error) {
      console.error('Error updating listing:', error);
      Alert.alert('Error', 'Could not update listing. Please try again.');
    }
  };

  const handleDeleteListing = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this listing?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const listingRef = ref(db, `listings/${listing.id}`);
              await remove(listingRef); // Delete the listing from the database
              Alert.alert('Success', 'Listing deleted successfully!');
              navigation.goBack(); // Navigate back after deletion
            } catch (error) {
              console.error('Error deleting listing:', error);
              Alert.alert('Error', 'Could not delete listing. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true, // Include Base64 in the response
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        const source = response.assets[0].base64; // Get the Base64 string
        setImage(source); // Set the Base64 image
      }
    });
  };

  // Set the header options

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Select an Image</Text> // Correctly wrapped
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={itemName}
        onChangeText={setItemName}
        placeholder="Item Name"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Item Category:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={itemCategory}
            onValueChange={(value) => setItemCategory(value)}
          >
            <Picker.Item label="Select a Category" value="" />
            <Picker.Item label="Electronics" value="electronics" />
            <Picker.Item label="Furniture" value="furniture" />
            <Picker.Item label="Clothing" value="clothing" />
            <Picker.Item label="Books" value="books" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Price per day"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={rentalDuration}
        onChangeText={setRentalDuration}
        placeholder="Rental Duration (days)"
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <Button title="Update Listing" onPress={handleUpdateListing} />
        <Button title="Delete Listing" onPress={handleDeleteListing} color="red" />
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
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-evenly', // Space between buttons
    marginTop: 10, // Add some margin if needed
  },
  backButton: {
    marginLeft: 10,
    padding: 5,
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  imagePicker: {
    height: 200,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePlaceholder: {
    color: '#007BFF',
    fontSize: 16,
  },
  pickerContainer: {
      height: 50,
      borderColor: '#007BFF',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
});

export default EditListing;
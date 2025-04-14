import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button } from 'react-native';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getAuth } from '@firebase/auth';
import { NavigationProp } from '@react-navigation/native';

const YourListings = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [listings, setListings] = useState<{ id: string; itemName: string; description: string; price: number; rentalDuration: number; image?: string }[]>([]);
  const auth = getAuth();

  useEffect(() => {
    const db = getDatabase();
    const listingsRef = ref(db, 'listings');

    // Fetch listings from Firebase
    const unsubscribe = onValue(listingsRef, (snapshot) => {
      const data = snapshot.val();
      const listingsArray = [];
      const userEmail = auth.currentUser ? auth.currentUser.email : null; // Get the current user's email

      for (let id in data) {
        // Check if the listing's userEmail matches the current user's email
        if (data[id].userEmail === userEmail) {
          listingsArray.push({ id, ...data[id] }); // Include the listing data
        }
      }

      setListings(listingsArray);
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe(); // Call the unsubscribe function to remove the listener
    };
  }, [auth.currentUser]);

  const renderItem = ({ item }: { item: { id: string; itemName: string; description: string; price: number; rentalDuration: number; image?: string } }) => {
    // Use the Base64 string if available, otherwise use a hardcoded URL
    const imageUri = item.image
      ? `data:image/jpeg;base64,${item.image}`
      : 'https://i.pinimg.com/236x/bc/fc/1b/bcfc1b5b3d20e3dd637ae6165ba8425f.jpg'; // Hardcoded stock image URL

    return (
      <View style={styles.listingContainer}>
        <Image
          source={{ uri: imageUri }} // Display the image
          style={styles.image}
        />
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price} per day</Text>
        <Text style={styles.rentalDuration}>{item.rentalDuration} days</Text>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('EditListing', { listing: item })} // Navigate to EditListing
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Listings</Text>
      {listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noListings}>No listings found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listingContainer: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  rentalDuration: {
    fontSize: 14,
    color: '#666',
  },
  noListings: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default YourListings;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getAuth } from '@firebase/auth';

const YourListings = () => {
  const [listings, setListings] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const db = getDatabase();
    const listingsRef = ref(db, 'listings');

    // Fetch listings from Firebase
    onValue(listingsRef, (snapshot) => {
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
      listingsRef.off();
    };
  }, [auth.currentUser]);

  const renderItem = ({ item }) => (
    <View style={styles.listingContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price} per day</Text>
      <Text style={styles.rentalDuration}>{item.rentalDuration} days</Text>
    </View>
  );

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
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  price: {
    fontSize: 16,
    color: '#007BFF',
  },
  rentalDuration: {
    fontSize: 14,
    color: '#888',
  },
  noListings: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default YourListings;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button } from 'react-native';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getAuth } from '@firebase/auth';

const YourListings = ({ navigation }) => {
  const [listings, setListings] = useState([]);
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

  const renderItem = ({ item }) => {
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
        <View style={styles.titleContainer}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <Text style={[styles.status, item.status === 'not_yet_rented' ? styles.notRented : styles.rented]}>
            {item.status === 'not_yet_rented' ? 'Not Rented' : 'Rented'}
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.price}>${item.price} per day</Text>
          <Text style={styles.rentalDuration}>Max Duration: {item.rentalDuration} Days</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="View More" onPress={() => navigation.navigate('ItemDetail', { listing: item })}/>
          <Button title="Edit" onPress={() => navigation.navigate('EditListing', { listing: item })}/>
        </View>
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
    marginTop: 5
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
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Space between buttons
    marginTop: 15,
    width: 150
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  notRented: {
    color: 'green', // Color for "Not Rented"
  },
  rented: {
    color: 'red', // Color for "Rented" (if you want to add this in the future)
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

export default YourListings;
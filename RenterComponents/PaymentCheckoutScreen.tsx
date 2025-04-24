import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, Image, ScrollView } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { getDatabase, ref, set } from '@firebase/database';
import { getAuth } from '@firebase/auth';

const PaymentCheckoutScreen = ({ navigation, route }) => {
  // Get the listing passed as parameter
  const { listing } = route.params;
  const auth = getAuth();

  // Payment fields
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
      Alert.alert('Error', 'Please fill in all payment details.');
      return;
    }

    setLoading(true);

    try {
      // Simulate advanced payment checkout API call using a dummy endpoint.
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          amount: listing.price, // Use appropriate conversion if needed
          cardHolderName,
          cardNumber,
          expiryDate,
          cvv,
          action: 'buy',
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      await response.json(); // Dummy call simulation

      // Update listing status in Firebase to mark it as "bought"
      const db = getDatabase();
      const user = auth.currentUser;
      const listingRef = ref(db, `listings/${listing.id}`);
      await set(listingRef, { ...listing, status: 'rented' , rentedBy: user.email});

           Alert.alert(
              'Success',
              'Payment successful!',
              [
                {
                  text: 'OK',
                  onPress: () =>
                   navigation.dispatch(
                     StackActions.popToTop()
                   ),
                },
              ],
              { cancelable: false }
            );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }

    setLoading(false);
  };

  // Helper function to return the listing image URI
  const getImageUri = () => {
    if (listing.image) {
      return `data:image/jpeg;base64,${listing.image}`;
    }
    return 'https://i.pinimg.com/236x/bc/fc/1b/bcfc1b5b3d20e3dd637ae6165ba8425f.jpg';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Payment Checkout</Text>

      {/* Listing Details Section */}
      <View style={styles.listingDetails}>
        <Image source={{ uri: getImageUri() }} style={styles.listingImage} />
        <View style={styles.listingTextContainer}>
          <Text style={styles.listingName}>{listing.itemName}</Text>
          <Text style={styles.listingCategory}>{listing.itemCategory}</Text>
          <Text style={styles.listingPrice}>${listing.price} per day</Text>
          <Text style={styles.listingDuration}>Max Duration: {listing.rentalDuration} Days</Text>
        </View>
      </View>

      {/* Payment Form */}
      <Text style={styles.label}>Card Holder Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        value={cardHolderName}
        onChangeText={setCardHolderName}
      />

      <Text style={styles.label}>Card Number:</Text>
      <TextInput
        style={styles.input}
        placeholder="1234 5678 9012 3456"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Expiry Date (MM/YY):</Text>
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        value={expiryDate}
        onChangeText={setExpiryDate}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>CVV:</Text>
      <TextInput
        style={styles.input}
        placeholder="123"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="number-pad"
        secureTextEntry={true}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />
      ) : (
        <Button title="Confirm Payment" onPress={handleConfirmPayment} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listingDetails: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  listingImage: {
    width: 100,
    height: 100,
  },
  listingTextContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  listingName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listingCategory: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  listingDuration: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    marginTop: 5,
  },
  loading: {
    marginTop: 20,
  },
});

export default PaymentCheckoutScreen;

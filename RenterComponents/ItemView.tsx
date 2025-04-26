import React from 'react';
import {View, Text, StyleSheet, Image, Button} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

// Define the interface for the listing item
interface Listing {
  itemName: string;
  description: string;
  price: number;
  rentalDuration: number;
  image: string | null;
  status: string;
  ratings?: number[]; // Optional ratings field
}

interface ListingItemRouteParams {
  listing: Listing;
}

interface ListingItemProps {
  route: RouteProp<{params: ListingItemRouteParams}, 'params'>;
  navigation: StackNavigationProp<any>;
}

const ItemView: React.FC<ListingItemProps> = ({ navigation, route }) => {
  const { listing } = route.params;
  const {
    itemName,
    description,
    price,
    rentalDuration,
    image,
    status,
    ratings = [],
  } = listing;

  // Filter out zero ratings
  const filteredRatings = ratings.filter(rating => rating > 0);

  // Calculate average rating
  const averageRating =
    filteredRatings.length > 0
      ? (
          filteredRatings.reduce((a, b) => a + b, 0) / filteredRatings.length
        ).toFixed(1)
      : 'No ratings yet';

  // Count of ratings
  const ratingsCount = filteredRatings.length;
  const btnTitle = 'Rent Now';

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={{uri: `data:image/jpeg;base64,${image}`}}
            style={styles.image}
          />
        ) : (
          <Text style={styles.imagePlaceholder}>No Image Available</Text>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text
            style={[
              styles.itemName,
              status === 'not_yet_rented' ? styles.notRented : styles.rented,
            ]}>
            {status === 'not_yet_rented' ? 'Not Rented' : 'Rented'}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.text}>${price} per day</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Rental Duration:</Text>
          <Text style={styles.text}>{rentalDuration} {rentalDuration > 1 ? 'days' : 'day'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Avg Rating: </Text>
          <Text style={styles.text}>
            {averageRating} ({ratingsCount} ratings)
          </Text>
        </View>
        <Text style={styles.description}>
          <Text style={styles.label}>Description:</Text> {description}
        </Text>
        {status === 'not_yet_rented' ? (
          <Button
                        title={btnTitle}
                        onPress={() => navigation.navigate('PaymentCheckoutScreen', { listing })}
                      />
        ) : (
          <Button title={btnTitle} disabled />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden', // Ensures the image and content are clipped to the rounded corners
    margin: 10,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light gray background for placeholder
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 15,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  rating: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007BFF', // Blue color for labels
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  notRented: {
    color: 'green', // Color for "Not Rented"
  },
  rented: {
    color: 'red', // Color for "Rented" (if you want to add this in the future)
  },
});

export default ItemView;
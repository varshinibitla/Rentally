import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Searchbox from '../RenterComponents/Searchbox';
import Listings from '../RenterComponents/Listings';
import {getDatabase, ref, onValue} from '@firebase/database';
import {getAuth} from '@firebase/auth';

interface Item {
  id: string;
  itemName: string;
  description: string;
  rentalDuration: number;
  price: number;
  image: string;
}

const MarketPlace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const auth = getAuth();

  React.useEffect(() => {
    const db = getDatabase();
    const listingsRef = ref(db, 'listings');

    // Fetch listings from Firebase
    const unsubscribe = onValue(listingsRef, snapshot => {
      const data = snapshot.val();
      const listingsArray = [];
      const userEmail = auth.currentUser ? auth.currentUser.email : null; // Get the current user's email

      for (let id in data) {
        // Exclude listings of current user
        if (data[id].userEmail !== userEmail) {
          listingsArray.push({id, ...data[id]}); // Include the listing data
        }
      }

      setListings(listingsArray);
      setFilteredData(listingsArray); // Set filtered data to all listings initially
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe(); // Call the unsubscribe function to remove the listener
    };
  }, [auth.currentUser]);

  const handleSearch = (text: string): void => {
    setSearchQuery(text);
    const filtered = listings.filter((item: Item) =>
      item.itemName.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
      <Searchbox
        placeholder="Discover items..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <Listings filteredData={filteredData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MarketPlace;
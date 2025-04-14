import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Searchbox from './components/Searchbox';
import Tabs from './components/Tabs';
import ItemCards from './components/ItemCards';

const tabs = [
  {
    title: 'Art',
    content: () => (
        <ItemCards/>
    ),
  },
  {
    title: 'Books',
    content: () => (
        <ItemCards/>
    ),
  },
  {
    title: 'Sports',
    content: () => (
        <ItemCards/>
    ),
  },
];

const MarketPlace = () => {
  return (
    <View style={styles.container}>
      <Searchbox placeholder="Discover items..." onChangeText={handleSearch} />
      <Tabs tabs={tabs} />
    </View>
  );
};

const handleSearch = (text: string) => {
  console.log('Search text:', text);
  // Add your search logic here
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MarketPlace;

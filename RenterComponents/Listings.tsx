import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  ItemView: {
    listing: {
      id: string;
      itemName: string;
      description: string;
      price: number;
      rentalDuration: number;
      image: string;
    };
  };
};

interface ListingsProps {
  filteredData: RootStackParamList['ItemView']['listing'][];
}

const Listings: React.FC<ListingsProps> = ({ filteredData }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return filteredData.length > 0 ? (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        numColumns={2}
        columnWrapperStyle={{gap: 10, paddingHorizontal: 10}}
        contentContainerStyle={{gap: 10, paddingBottom: 20}}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                navigation.navigate('ItemView', {listing: item}); // Navigate to ItemView
              }}>
              <Image
                style={styles.itemImage}
                source={{
                  uri: item.image
                    ? `data:image/jpeg;base64,${item.image}`
                    : 'https://i.pinimg.com/236x/bc/fc/1b/bcfc1b5b3d20e3dd637ae6165ba8425f.jpg',
                }}
              />
              <View style={styles.itemTextContainer}>
                <Text style={[styles.itemText, styles.itemName]}>
                  {item.itemName}
                </Text>
                <Text style={styles.itemText}>{item.description}</Text>
                <Text style={styles.itemText}>${item.price} per day</Text>
                <Text style={styles.itemText}>
                  Max Duration: {item.rentalDuration}{' '}
                  {item.rentalDuration > 1 ? 'days' : 'day'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  ) : (
    <Text style={styles.notFoundText}>No listings found.</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    width: 100,
  },
  itemImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 150,
  },
  itemTextContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
  },
  itemText: {
    color: 'black',
    marginHorizontal: 20,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notFoundText: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
});

export default Listings;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

type ItemCardsProps = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
};

const items = [
  {
    id: 1,
    name: 'Item 1',
    description: 'Item 1 Description',
    price: 10,
    rentalDuration: 5,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
  {
    id: 2,
    name: 'Item 2',
    description: 'Item 2 Description',
    price: 20,
    rentalDuration: 3,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
  {
    id: 3,
    name: 'Item 3',
    description: 'Item 3 Description',
    price: 30,
    rentalDuration: 7,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
  {
    id: 4,
    name: 'Item 4',
    description: 'Item 4 Description',
    price: 25,
    rentalDuration: 7,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
  {
    id: 5,
    name: 'Item 5',
    description: 'Item 5 Description',
    price: 50,
    rentalDuration: 7,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
  {
    id: 6,
    name: 'Item 6',
    description: 'Item 6 Description',
    price: 40,
    rentalDuration: 7,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
  {
    id: 7,
    name: 'Item 7',
    description: 'Item 7 Description',
    price: 35,
    rentalDuration: 7,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
  {
    id: 8,
    name: 'Item 8',
    description: 'Item 8 Description',
    price: 20,
    rentalDuration: 7,
    image: 'https://legacy.reactjs.org/logo-og.png',
  },
];

const ItemCards = (props: ItemCardsProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        numColumns={2}
        columnWrapperStyle={{gap: 10, paddingHorizontal: 10}}
        contentContainerStyle={{gap: 10, paddingBottom: 20}}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <TouchableOpacity style={styles.item}>
              <Image style={styles.itemImage} source={{uri: item.image}} />
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemText, styles.itemName]}>{item.name}</Text>
                  <Text style={styles.itemText}>{item.description}</Text>
                  <Text style={styles.itemText}>{item.price} per day</Text>
                  <Text style={styles.itemText}>{item.rentalDuration} days</Text>
                </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
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
    borderRadius: 10,
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
  }
});

export default ItemCards;

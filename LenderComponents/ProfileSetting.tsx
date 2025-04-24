import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getAuth } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AddListings from './AddListings';
import { useFocusEffect } from '@react-navigation/native';

const ProfileSetting = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [listings, setListings] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // To handle tab selection
  const auth = getAuth();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const db = getDatabase();
      const user = auth.currentUser;

      if (user) {
        const userRef = ref(db, 'userinfo/' + user.displayName);
        const postsRef = ref(db, 'listings');

        const unsubscribeUser = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserInfo(data);
          } else {
            console.log("No user information found for this username.");
          }
          setLoading(false);
        });

        const unsubscribePosts = onValue(postsRef, (snapshot) => {
          const postsData = snapshot.val();
          const userListings = [];
          const userBorrowedItems = [];
          const ratings = [];
          
          for (let id in postsData) {
            const post = { ...postsData[id], id }; // Add the id to the post object
            
            // Adding user's listings
            if (post.userEmail === user.email) {
              userListings.push(post);
              if (post.ratings && Array.isArray(post.ratings)) {
                ratings.push(...post.ratings);
              }
            }
            
            // Adding items borrowed by the user
            if (post.rentedBy === user.email) {
              console.log("Found borrowed item:", post.itemName);
              userBorrowedItems.push(post);
            }
          }
          
          console.log("Total borrowed items:", userBorrowedItems.length);
          setListings(userListings);
          setBorrowedItems(userBorrowedItems);

          const filteredRatings = ratings.filter(rating => rating > 0);
          if (filteredRatings.length > 0) {
            const total = filteredRatings.reduce((acc, rating) => acc + rating, 0);
            const avg = total / filteredRatings.length;
            setAverageRating(avg);
          } else {
            setAverageRating(0); // No valid ratings found
          }
        });

        return () => {
          unsubscribeUser();
          unsubscribePosts();
        };
      } else {
        console.log("No user is currently signed in.");
        setLoading(false);
      }
    }, [auth.currentUser])
  );

  // Debug function - can be removed in production
  const debugBorrowedItems = () => {
    console.log("Current borrowedItems state:", borrowedItems);
    
    const db = getDatabase();
    const postsRef = ref(db, 'listings');
    const user = auth.currentUser;
    
    if (user) {
      onValue(postsRef, (snapshot) => {
        const postsData = snapshot.val();
        console.log("All listings count:", Object.keys(postsData || {}).length);
        
        let count = 0;
        for (let id in postsData) {
          if (postsData[id].status === 'rented' && 
              postsData[id].rentedBy === user.email) {
            count++;
            console.log("Found item:", postsData[id].itemName);
          }
        }
        console.log("Manual count of borrowed items:", count);
      }, { onlyOnce: true });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderListing = ({ item }) => {
    const imageUri = item.image
      ? { uri: `data:image/jpeg;base64,${item.image}` }
      : { uri: 'https://i.pinimg.com/236x/bc/fc/1b/bcfc1b5b3d20e3dd637ae6165ba8425f.jpg' };

    return (
      <View style={styles.listingContainer}>
        <TouchableOpacity 
          style={styles.touchableContainer} 
          onPress={() => {
            navigation.navigate('ItemDetail', { listing: item });
          }}
        >
          <Image source={imageUri} style={styles.listingImage} />
          <Text style={styles.listingName}>{item.itemName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Same rendering for borrowed items
  const renderBorrowedItem = ({ item }) => {
    const imageUri = item.image
      ? { uri: `data:image/jpeg;base64,${item.image}` }
      : { uri: 'https://i.pinimg.com/236x/bc/fc/1b/bcfc1b5b3d20e3dd637ae6165ba8425f.jpg' };

    return (
      <View style={styles.listingContainer}>
        <TouchableOpacity 
          style={styles.touchableContainer} 
          onPress={() => {
            navigation.navigate('ItemDetailBorrow', { listing: item });
          }}
        >
          <Image source={imageUri} style={styles.listingImage} />
          <Text style={styles.listingName}>{item.itemName}</Text>
          <Text style={styles.borrowedStatus}>Borrowed</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userInfo.profilePicture }}
          style={styles.profilePicture}
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.username}>{userInfo.username}</Text>
          <Text style={styles.bio}>
            Joined on {new Date(userInfo.joinDate).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <Text style={styles.averageRating}>
            Average Rating: {averageRating.toFixed(1)}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddListings')}>
          <Text style={styles.buttonText}>Add Listing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 0 && styles.activeTab]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>Listed Items</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, selectedTab === 1 && styles.activeTab]}
          onPress={() => {
            setSelectedTab(1);
            // Debug when switching to borrowed tab
            debugBorrowedItems();
          }}
        >
          <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>Borrowed Items</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {selectedTab === 0 ? (
        listings.length > 0 ? (
          <FlatList
            data={listings}
            renderItem={renderListing}
            keyExtractor={(item, index) => `listing-${index}`}
            numColumns={3}
            contentContainerStyle={styles.listingsContainer}
          />
        ) : (
          <View style={styles.emptyTabContent}>
            <Text style={styles.emptyTabText}>You have no listed items</Text>
          </View>
        )
      ) : (
        <View style={{ flex: 1 }}>
          {borrowedItems.length > 0 ? (
            <FlatList
              data={borrowedItems}
              renderItem={renderBorrowedItem}
              keyExtractor={(item, index) => `borrowed-${index}`}
              numColumns={3}
              contentContainerStyle={styles.listingsContainer}
            />
          ) : (
            <View style={styles.emptyTabContent}>
              <Text style={styles.emptyTabText}>You have no borrowed items</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    color: '#666',
  },
  averageRating: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listingContainer: {
    width: '30%',
    height: 150,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 0,
  },
  touchableContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  listingName: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  borrowedStatus: {
    fontSize: 12,
    color: '#007BFF',
    fontStyle: 'italic',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#ddd',
  },
  activeTab: {
    borderBottomColor: '#007BFF',
  },
  tabText: {
    fontSize: 18,
    color: '#333',
  },
  activeTabText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  emptyTabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTabText: {
    fontSize: 20,
    color: '#aaa',
  },
  listingsContainer: {
    paddingBottom: 20,
  },
});

export default ProfileSetting;
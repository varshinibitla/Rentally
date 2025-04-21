import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getDatabase, ref, onValue } from '@firebase/database';
import { getAuth } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileSetting = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [listings, setListings] = useState([]);
  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(db, 'userinfo/' + user.displayName);
      const postsRef = ref(db, 'listings'); // Assuming posts are stored under 'listings'

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
        const ratings = [];
        for (let id in postsData) {
          if (postsData[id].userEmail === user.email) { // Check if the post belongs to the user
            userListings.push(postsData[id]); // Collect user listings
            ratings.push(...postsData[id].ratings); // Assuming ratings is an array
          }
        }
        setListings(userListings);
        
        // Filter out zero ratings (index 0 rating)
        const filteredRatings = ratings.filter(rating => rating > 0);
        if (filteredRatings.length > 0) {
          const total = filteredRatings.reduce((acc, rating) => acc + rating, 0);
          const avg = total / filteredRatings.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0); // No valid ratings found
        }
      });

      // Cleanup listeners on unmount
      return () => {
        unsubscribeUser();
        unsubscribePosts();
      };
    } else {
      console.log("No user is currently signed in.");
      setLoading(false);
    }
  }, [auth.currentUser]);

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
  
    console.log("Image source:", imageUri); // Better debug logging
  
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
        <TouchableOpacity style={styles.button} onPress={() => {/* Navigate to Edit Profile */}}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate('Chatbot')}}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listings}
        renderItem={renderListing}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.listingsContainer}
      />
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
    width: '30%', // Set a fixed width for uniformity
    height: 150, // Set a fixed height for uniformity
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 0,
  },
  touchableContainer: {
    width: '100%',  // Make sure it takes full width
    height: '100%', // And full height
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
});

export default ProfileSetting;
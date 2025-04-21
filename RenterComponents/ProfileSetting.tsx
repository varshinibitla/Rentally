import React from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';

const ProfileSettings = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.switchToText}>Navigate to: </Text>
        <View style={styles.button}>
          <Button title="Lander View" onPress={() => navigation.navigate('LenderHome')} />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Arrange buttons in a row
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 20, // Add some margin if needed
  },
  switchToText: {
    margin: 20,
    paddingTop: 10,
  },
  button: {
    // margin: 20,
  },
});

export default ProfileSettings;

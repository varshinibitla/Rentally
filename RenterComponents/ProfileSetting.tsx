import React from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';

const ProfileSettings = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Text>Switch to: </Text>
        <Button title="Lander View" onPress={() => navigation.navigate('LenderHome')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProfileSettings;

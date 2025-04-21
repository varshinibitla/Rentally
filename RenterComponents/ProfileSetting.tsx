import React from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';

const ProfileSettings = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.switchToText}>Navigate to: </Text>
        <Button title="Lender Home" onPress={() => navigation.navigate('LenderHome')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  switchToText: {
    margin: 20,
    paddingTop: 10,
  },
});

export default ProfileSettings;

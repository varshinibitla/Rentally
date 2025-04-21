import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type SearchboxProps = {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
};

const Searchbox = (props: SearchboxProps) => {
  const [searchText, setSearchText] = React.useState<string>('');

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputSubContainer}>
        <Text style={styles.searchIcon}>
          <MaterialIcons name="search" size={24} color={'black'} />
        </Text>
        <TextInput
            style={styles.searchInput}
            placeholder={props.placeholder || 'Search...'}
            clearButtonMode="always"
            autoCorrect={false}
            autoCapitalize="none"
            value={props.value}
            onChangeText={props.onChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    inputSubContainer: {
        flexDirection: 'row',
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        top: 8,
        color: '#000000',
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        paddingLeft: 40,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'grey',
    },
    cartIcon: {
      position: 'absolute',
      left: 10,
      top: 8,
      color: '#000000',
      zIndex: 1,
  },
});

export default Searchbox;

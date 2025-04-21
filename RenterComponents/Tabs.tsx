import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

type TabsProps = {
  tabs?: Array<{title: string; content: () => any}>;
  // Define any props you want to pass to the Tabs component
};

const Tabs = (props: TabsProps) => {
  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {props.tabs?.map((tab, i) => {
          const isActive = index === i;
          return (
            <TouchableOpacity
                key={i}
                onPress={() => setIndex(i)}
                style={styles.tab}>
                <Text style={isActive ? styles.activeTabText : styles.tabText}>
                    {tab.title}
                </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {props.tabs && props.tabs[index]?.content()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  tab: {
    marginHorizontal: 50,
  },
  tabText: {
    color: 'grey',
  },
  activeTabText: {
    color: 'black',
    fontWeight: 'bold',
  },
  dot: {

  }
});

export default Tabs;
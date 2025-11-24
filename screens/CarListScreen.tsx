import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CarListScreen(){
  return (
    <View style={styles.container}>
      <Text>Car List Screen</Text>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

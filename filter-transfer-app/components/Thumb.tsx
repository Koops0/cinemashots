import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CustomThumb({ value: number }) {
    console.log(value);
    return (
  <View style={styles.thumb}>
    <Text style={styles.thumbText}>{Math.round(value * 100)}</Text>
  </View>
);
}

const styles = StyleSheet.create({
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});
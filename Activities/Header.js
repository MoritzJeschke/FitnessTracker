import React from 'react';
import {Button, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import TrackerActivity from './TrackerActivity';

export default function Header() {
  return (
    <View style={styles.header}>
        <Text style={styles.headerText}>Tracker</Text>
        {/* eslint-disable-next-line no-undef */}
        <Button title={'Save Run'} onPress={TrackerActivity.saveData()} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
  }
});

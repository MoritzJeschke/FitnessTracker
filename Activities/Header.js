import React from 'react';
import {Button, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import TrackerActivity from './TrackerActivity';

export default function Header() {
  var trackerActivity = new TrackerActivity();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Tracker</Text>
        <Button title={'Save Run'} onPress={trackerActivity.saveData()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

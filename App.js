import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import TrackerActivity from './Activities/TrackerActivity';
import HistoryActivity from './Activities/HistorieActivity';
import MapView from 'react-native-maps';
import { Row } from 'react-native-table-component';

/* eslint-disable prettier/prettier */
export class App extends Component {

  gotoHistorie = () => {
    this.props.navigation.navigate('Historie');
  }

  gotoTracker = () => {
    this.props.navigation.navigate('Tracker');
  }

  render() {
    return (
      <View>
        <MapView style={styles.map}
                  initialRegion={{
                      latitude: 50.199759,
                      longitude: 8.665006,
                      latitudeDelta: 10,
                      longitudeDelta: 10,
                  }}
          />

        <View style={styles.container}>
          <Button title='HistorieActivity' onPress={this.gotoHistorie}></Button>
          <Button title='TrackerActivity' onPress={this.gotoTracker}></Button>
        </View>
        
        
      </View>
    );
  }

}

const AppNavigator = createStackNavigator ({
  Mainmenu: { screen: App },
  Historie: { screen: HistoryActivity },
  Tracker: { screen: TrackerActivity }
});

const styles = StyleSheet.create({
  map: {
      width: 500,
      height: 500,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default createAppContainer(AppNavigator);

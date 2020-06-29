import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import TrackerActivity from './Activities/TrackerActivity';
import HistoryActivity from './Activities/HistorieActivity';
import MapView from 'react-native-maps';

export class App extends Component {

  gotoHistorie = () => {
    this.props.navigation.navigate('historie');
  }

  gotoTracker = () => {
    this.props.navigation.navigate('tracker');
  }

  render() {
    return (
      <View>
        <Text>
          This is the Mainmenu!
        </Text>
        <Button title='HistorieActivity' onPress={this.gotoHistorie}></Button>
        <Button title='TrackerActivity' onPress={this.gotoTracker}></Button>
        <View style={styles.container}>
          <MapView style={styles.map}
                  initialRegion={{
                      latitude: 37.78825,
                      longitude: -122.4324,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                  }}
          />
        </View>
      </View>
    );
  }

}
  
const AppNavigator = createStackNavigator ({
  main: { screen: App },
  historie: { screen: HistoryActivity },
  tracker: { screen: TrackerActivity }
});

const styles = StyleSheet.create({
  container:{
      position: 'absolute',
      top: 0,
      left:0,
      bottom:0,
      right:0,
      justifyContent: 'flex-end',
      alignItems: 'center',
  },
  map: {
      position: 'absolute',
      top: 0,
      left:0,
      bottom:0,
      right:0,
  }
});

export default createAppContainer(AppNavigator);

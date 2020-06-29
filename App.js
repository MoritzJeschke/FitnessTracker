/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import MapView from 'react-native-maps';


export default class FitnessTracker extends Component {

    render() {
        return (
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
        );
    }
}

const styles = StyleSheet.create({
    number: {
        textAlign: 'center',
        marginVertical: 8,
    },
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

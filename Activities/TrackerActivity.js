import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapView, {Polyline, AnimatedRegion, Animated} from 'react-native-maps';
import {LineChart} from 'react-native-chart-kit';

const {width, height} = Dimensions.get('window');

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const RATIO = width / height;
let LATTITUDE_DELTA = 0.005;
let LONGITUDE_DELTA = 0.005;

/* eslint-disable prettier/prettier */
export default class TrackerActivity extends Component {

    constructor() {
        super();

        console.log('constuctor');

        this.state = {
            position: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: LONGITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            lastPositions: [],
            initialHeight: undefined,
            heightData: [0],
        };
    }

    getCurrentHeight(userLocation) {



        const http = new XMLHttpRequest();
        const url = 'https://api.airmap.com/elevation/v1/ele/?points=' + userLocation.latitude + ',' + userLocation.longitude; // 8.580695,50.230894;8.5806205,50.2294911

        http.open('GET', url);

        http.responseType = 'json';

        http.onload = () => {

            let responseData = http.response.data[0];

            if (this.state.initialHeight === undefined) {
                this.setState({initialHeight: responseData});
            }
            this.setState({heightData: [...this.state.heightData, (responseData - this.state.initialHeight)]});
            console.log('data', this.state.heightData, this.state.initialHeight);

        };

        http.send(null);

         // navigator.geolocation = require('@react-native-community/geolocation');
//
         // navigator.geolocation.getCurrentPosition((position) => {
//
         //     if (this.state.initialHeight === undefined) {
         //         this.setState({initialHeight: position.coords.altitude});
         //     }
//
         //     this.setState({heightData: [...this.state.heightData, (position.coords.altitude - this.state.initialHeight)]});
//
         //     console.log('data', this.state.heightData, this.state.initialHeight);
         // }, (error) => {
         //     this.setState({heightData: [...this.state.heightData, (this.state.heightData[this.state.heightData.length - 1])]});
         //     console.log(error.message);
         // }, {enableHighAccuracy: true, timeout: 5000, maximumAge: 5000});
    }

    addNewPosition(newUserLocation): void {

        // TODO : add cache; Cache data if device is turned off; Process Data if device is turned on -> Save mobile Data

        const newLocation = {
            latitude: newUserLocation.latitude,
            longitude: newUserLocation.longitude,
            latitudeDelta: LATTITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        // TODO :: test IF statement
        const lastPosition = this.state.lastPositions[this.state.lastPositions.length - 1];
        if (lastPosition == null) {
            // if no initialRegion
            this.setState({lastPositions: [...this.state.lastPositions, (newLocation)]});
        } else if (this.getDistanceBetweenPoints(newLocation, lastPosition) > 6) {
            // if distance between points greater than 6 m
            this.getNearestStreet(newLocation);
        } else {
            console.log('skied Http');
        }
        console.log(this.state.lastPositions.length, this.state.heightData.length);
    }

    getNearestStreet(userLocation): any {

        const http = new XMLHttpRequest();
        const url = 'http://router.project-osrm.org/nearest/v1/foot/' + userLocation.longitude + ',' + userLocation.latitude; // 8.580695,50.230894;8.5806205,50.2294911

        http.open('GET', url);

        http.responseType = 'json';

        http.onload = () => {

            let responseData = http.response.waypoints;
            responseData = responseData[0];
            responseData = responseData.location;

            const newStreetLocation = {
                latitude: responseData[1],
                longitude: responseData[0],
                latitudeDelta: LATTITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };

            if (this.getDistanceBetweenPoints(userLocation, newStreetLocation) > 15) {
                this.addPosToPolyline(userLocation);
                console.log('added Point');
            } else {
                this.addPosToPolyline(newStreetLocation);
                console.log('added Street');
            }

        };

        http.send(null);
    }

    addPosToPolyline(newUserLocation) {

        const newLocation = {
            latitude: newUserLocation.latitude,
            longitude: newUserLocation.longitude,
            latitudeDelta: LATTITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        // only add new Location if it is new
        if (!this.state.lastPositions.filter((value => value.latitude === newLocation.latitude && value.longitude === newLocation.longitude)).length > 0) {
            this.setState({lastPositions: [...this.state.lastPositions, (newLocation)]});
            this.getCurrentHeight(newLocation);
            console.log('added new Position');
        }

    }

    getDistanceBetweenPoints(newLocation, lastUserLocation): number {

        const R = 6371e3; // metres
        const r1 = newLocation.latitude * Math.PI / 180; // φ, λ in radians
        const r2 = lastUserLocation.latitude * Math.PI / 180;
        const d1 = (lastUserLocation.latitude - newLocation.latitude) * Math.PI / 180;
        const d2 = (lastUserLocation.longitude - newLocation.longitude) * Math.PI / 180;

        const a = Math.sin(d1 / 2) * Math.sin(d1 / 2) +
            Math.cos(r1) * Math.cos(r2) *
            Math.sin(d2 / 2) * Math.sin(d2 / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres

        console.log(d);
        return d;
    }

    render() {
        return (
            <View>
                <Text>
                    This is the TrackerActivity!
                </Text>

                <MapView style={styles.map}
                         showsMyLocationButton={true}
                         initialRegion={this.state.position}
                         region={this.state.lastPositions[this.state.lastPositions.length - 1]}
                         showsUserLocation={true}
                         followsUserLocation={true}
                         onUserLocationChange={(newUserLocation) => this.addNewPosition(newUserLocation.nativeEvent.coordinate)}>

                    <Polyline coordinates={this.state.lastPositions}/>
                </MapView>

                <LineChart
                    data={{
                        labels: ["January", "February", "March", "April", "May", "June"],
                        datasets: [
                            {
                                data: this.state.heightData
                            }
                        ]
                    }}
                    width={Dimensions.get("window").width} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="m"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "2",
                            strokeWidth: "1",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier={true}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    map: {
        width: width,
        height: height / 4 * 2,
    },
    diagram: {
        width: width,
        height: height / 4 * 2,
    },
});

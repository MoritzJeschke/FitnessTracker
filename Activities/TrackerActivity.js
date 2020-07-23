import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapView, {Polyline} from 'react-native-maps';
import {LineChart} from 'react-native-chart-kit';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {Row, Table} from 'react-native-table-component';
import Datahandler from '../Datahandler';
import Data from '../Data';

const {width, height} = Dimensions.get('window');

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
let LATTITUDE_DELTA = 0.005;
let LONGITUDE_DELTA = 0.005;

let intervallID = 0;

let distance = 0;
let lastHeight = 0;
let totalHeight = 0;
let tableHeadAverage = ['km', 'height', 'Ø min/km'];
let startTime = new Date();
let sendHTTP = true;

/* eslint-disable prettier/prettier */
export default class TrackerActivity extends Component {

    constructor() {
        super();

        console.log('constuctor');

        this.state = {
            position: {
                latitude: 50.199759,
                longitude: 8.665006,
                latitudeDelta: 10,
                longitudeDelta: 10,
            },
            lastPositions: [],
            initialHeight: undefined,
            heightData: [0],
            tableDateAverage: [0, 0, 0],
        };
        BackgroundGeolocation.start();
    }

    componentDidMount(): void {

        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 2,
            distanceFilter: 2,
            notificationTitle: 'Fitness Tracker is tracking Location',
            notificationText: '',
            notificationsEnabled: false,
            debug: false,
            startOnBoot: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 3000,
            fastestInterval: 3000,
            activitiesInterval: 3000,
            stopOnStillActivity: false,
        });

        BackgroundGeolocation.on('location', async (location) => {
            console.log(location);

            const newLocation = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: LATTITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };

            await this.addNewPosition(newLocation);
            // backgroundPositions.push(newLocation);
        });

        BackgroundGeolocation.on('error', (error) => {
            console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {
            console.log('[INFO] BackgroundGeolocation service has been started');
        });

        BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });
    }

    async addNewPosition(newUserLocation): void {
        if (sendHTTP) {
            sendHTTP = false;
            const lastPosition = this.state.lastPositions[this.state.lastPositions.length - 1];
            if (lastPosition == null) {
                // if no initialRegion
                this.setState({lastPositions: [...this.state.lastPositions, (newUserLocation)]});
            } else if (this.getDistanceBetweenPoints(newUserLocation, lastPosition) > 6) {
                // if distance between points greater than 6 m
                await this.getNearestStreet(newUserLocation);
            } else {
                //console.log('skied Http');
            }
            sendHTTP = true;
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

        // console.log(d);
        return d;
    }

    async getNearestStreet(userLocation): any {
        // Http request to get nearest Street from Position

        console.log('send');
        const http = new XMLHttpRequest();
        const url = 'http://router.project-osrm.org/nearest/v1/foot/' + userLocation.longitude + ',' + userLocation.latitude; // 8.580695,50.230894;8.5806205,50.2294911

        let response = await fetch(url);
        let responseJson = await response.json();

        let responseData = responseJson.waypoints;
        responseData = responseData[0];
        responseData = responseData.location;

        const newStreetLocation = {
            latitude: responseData[1],
            longitude: responseData[0],
            latitudeDelta: LATTITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        console.log('got');
        if (this.getDistanceBetweenPoints(userLocation, newStreetLocation) > 15) {
            // if street is more than 15 m from user position add position to polyline
            this.addPosToPolyline(userLocation);
            //console.log('added Point');
        } else {
            // if street is less than 15 m from user position add street position to polyline
            this.addPosToPolyline(newStreetLocation);
            //console.log('added Street');
        }
        console.log('finished');
    }

    addPosToPolyline(newUserLocation) {
        // add point to polyline

        const newLocation = {
            latitude: newUserLocation.latitude,
            longitude: newUserLocation.longitude,
            latitudeDelta: LATTITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        // only add new Location if it is new
        if (!this.state.lastPositions.filter((value => value.latitude === newLocation.latitude && value.longitude === newLocation.longitude)).length > 0) {
            // add to distance
            distance += this.getDistanceBetweenPoints(newUserLocation, this.state.lastPositions[this.state.lastPositions.length - 1]);

            this.setState({lastPositions: [...this.state.lastPositions, (newLocation)]});
            this.getCurrentHeight(newLocation);
        }
    }

    async getCurrentHeight(userLocation) {

        // send http request to get elevation at point

        const http = new XMLHttpRequest();
        const url = 'https://api.airmap.com/elevation/v1/ele/?points=' + userLocation.latitude + ',' + userLocation.longitude; // 8.580695,50.230894;8.5806205,50.2294911

        const data = await http.response;

        http.open('GET', url);

        http.responseType = 'json';

        http.onload = () => {

            let responseData = http.response.data[0];

            if (this.state.initialHeight === undefined) {
                this.setState({initialHeight: responseData});
            }

            this.setState({heightData: [...this.state.heightData, (responseData - this.state.initialHeight)]});

            // TODO :: shorten function
            if (responseData - this.state.initialHeight < 0) {
                // current height under 0m
                if (lastHeight !== (responseData - this.state.initialHeight)) {

                    if (lastHeight < (responseData - this.state.initialHeight)) {
                        // up
                        console.log('1', lastHeight);
                        totalHeight += (responseData - this.state.initialHeight) + lastHeight * -1;
                        lastHeight = (responseData - this.state.initialHeight);
                        console.log('1', lastHeight);
                    } else {
                        // down
                        console.log('2', lastHeight);
                        totalHeight += lastHeight + (responseData - this.state.initialHeight) * -1;
                        lastHeight = (responseData - this.state.initialHeight);
                        console.log('2', lastHeight);
                    }
                }
            } else {
                // current height over 0m
                if (lastHeight !== (responseData - this.state.initialHeight)) {

                    if (lastHeight < (responseData - this.state.initialHeight)) {
                        // up
                        console.log('3', lastHeight);
                        totalHeight += (responseData - this.state.initialHeight) - lastHeight;
                        lastHeight = (responseData - this.state.initialHeight);
                        console.log('3', lastHeight);
                    } else {
                        // down
                        console.log('4', lastHeight);
                        totalHeight += lastHeight - (responseData - this.state.initialHeight);
                        lastHeight = (responseData - this.state.initialHeight);
                        console.log('4', lastHeight);
                    }
                }
            }
            console.log(startTime.getMilliseconds());

            this.setState({tableDateAverage: [(distance / 1000).toFixed(3), totalHeight, ((new Date().getMinutes() - startTime.getMinutes()) / (distance / 1000)).toFixed(2)]});
        };

        http.send(null);
    }

    saveData(){
        console.log("asdasdasdasdasdadasdas")

        //BackgroundGeolocation.stop();

        // var dh = new Datahandler();
        // dh.storeData(new Data(new Date().getDate(), distance, 20, height));
    }

    render() {
        return (
            <View>
                <MapView style={styles.map}
                         showsMyLocationButton={true}
                         initialRegion={this.state.position}
                         region={this.state.lastPositions[this.state.lastPositions.length - 1]}
                         showsUserLocation={true}
                         followsUserLocation={true}
                >

                    <Polyline coordinates={this.state.lastPositions}/>
                </MapView>

                <Table borderStyle={styles.tableBorder} style={styles.table}>
                    <Row style={styles.tableHeader} data={tableHeadAverage}/>
                    <Row textStyle={styles.centerText} style={styles.tableBody} data={this.state.tableDateAverage}/>
                </Table>

                <LineChart
                    data={{
                        datasets: [
                            {
                                data: this.state.heightData,
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="m"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '2',
                            strokeWidth: '1',
                            stroke: '#ffa726',
                        },
                    }}
                    bezier={true}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
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
    tableHeader: {
        backgroundColor: '#fb8c00'
    },
    tableBorder: {
        borderWidth: 1,
        borderColor: '#000000'
    },
    table: {
        margin: 5
    },
    header: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontWeight:'bold',
        fontSize:20,
        color:'#333',
        letterSpacing: 1
    }
});

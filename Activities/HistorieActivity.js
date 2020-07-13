import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

export default class HistoryActivity extends Component {

    constructor(props) {

        super(props);

        //last 7 days table
        this.tableHeadLastDays = ['Datum', 'Kilometer', 'Minuten', 'Minuten/km'];
        this.tableDataLastDays = [
            ['2020-05-06', 2, '3', '4'],
            ['a', 1, '4', 'd'],
            ['1', 2, '3', '456'],
            ['a', 1, '1', 'd'],
            ['a', 3, '2', 'd'],
            ['a', 5, '0', 'd'],
            ['a', 3, '6', 'd']
          ];

          //average table
          this.tableHeadAverage = ['Ø km', 'Ø Minuten', 'Ø Minuten/km'];
          //calc average data
          var sumKm = 0;
          var sumTime = 0;
          for (var i = 0; i < this.tableDataLastDays.length; i++) {
            sumKm += Number.parseInt(this.tableDataLastDays[i][1]);
            sumTime += Number.parseInt(this.tableDataLastDays[i][2]);
          }
          const avgKm = (sumKm / this.tableDataLastDays.length).toFixed(3);
          const avgTime = (sumTime / this.tableDataLastDays.length).toFixed(2);
          this.tableDateAverage = [avgKm, avgTime, (avgTime / avgKm).toFixed(2)];

    }

    render() {
        return (
            <View>
                <Table borderStyle={styles.tableBorder} style={styles.table}>
                    <Row style={styles.tableHeader} data={this.tableHeadLastDays}/>
                    <Rows textStyle={styles.centerText} style={styles.tableBody} data={this.tableDataLastDays}/>
                </Table>
                
                <Table borderStyle={styles.tableBorder} style={styles.table}>
                    <Row style={styles.tableHeader} data={this.tableHeadAverage}/>
                    <Row textStyle={styles.centerText} style={styles.tableBody} data={this.tableDateAverage}/>
                </Table>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tableHeader: {
        backgroundColor: '#4ae072'
    },

    tableBorder: {
        borderWidth: 1,
        borderColor: '#000000'
    },

    table: {
        margin: 20
    },

    centerText: {
        textAlign: 'center'
    }

  });
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import Data from '../Data';
import Datahandler from '../Datahandler';

export default class HistoryActivity extends Component {
    constructor(props) {
        super(props);

        var dh = new Datahandler();
        dh.storeData(new Data('23-07-2020', 10, 20, 666));
        dh.getLastDays().then((td) => {
                
            //last 7 days table
            this.tableHeadLastDays = ['Datum', 'Kilometer', 'Höhen-\nmeter', 'Minuten', 'Minuten/km'];
            this.tableDataLastDays = this.getTabelData(td);

            //average table
            this.tableHeadAverage = ['Ø km', 'Ø Höhenmeter', 'Ø Minuten', 'Ø Minuten/km'];
            //calc average data
            var sumKm = 0;
            var sumHm = 0;
            var sumTime = 0;
            for (var i = 0; i < this.tableDataLastDays.length; i++) {
                //Sum of all values in the second column (Distance)
                sumKm += Number.parseInt(this.tableDataLastDays[i][1]);
                //Sum of all values in the third column (Height)
                sumHm += Number.parseInt(this.tableDataLastDays[i][2])
                //Sum of all values in the fourth column (Time)
                sumTime += Number.parseInt(this.tableDataLastDays[i][3]);
            }
            //calculate average Distance, Height and time and cut the decimal places
            const avgKm = (sumKm / this.tableDataLastDays.length).toFixed(3);
            const avgHm = (sumHm /this.tableDataLastDays.length).toFixed(0);
            const avgTime = (sumTime / this.tableDataLastDays.length).toFixed(2);
            this.tableDateAverage = [avgKm, avgHm, avgTime, (avgTime / avgKm).toFixed(2)];

            //rerender the view cuz retrieving of data is delayed
            this.forceUpdate();
        }
        );
            
    }

    getTabelData(td) {
        var tableData = [];
        for (let i = 0; i < td.length; i++) {
            tableData.push([td[i].date, td[i].distance, td[i].height, td[i].time, (td[i].time / td[i].distance).toFixed(2)]);
        }

        console.log(tableData);
    }

  render() {
    return (
      <View>
        <Table borderStyle={styles.tableBorder} style={styles.table}>
          <Row style={styles.tableHeader} data={this.tableHeadLastDays} />
          <Rows
            textStyle={styles.centerText}
            style={styles.tableBody}
            data={this.tableDataLastDays}
          />
        </Table>

        <Table borderStyle={styles.tableBorder} style={styles.table}>
          <Row style={styles.tableHeader} data={this.tableHeadAverage} />
          <Row
            textStyle={styles.centerText}
            style={styles.tableBody}
            data={this.tableDateAverage}
          />
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tableHeader: {
    backgroundColor: '#4ae072',
  },

  tableBorder: {
    borderWidth: 1,
    borderColor: '#000000',
  },

  table: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,
  },

  centerText: {
    textAlign: 'center',
  },
});

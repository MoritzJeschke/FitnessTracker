import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import Data from '../Data';
import Datahandler from '../Datahandler';

export default class HistoryActivity extends Component {
    constructor(props) {
        super(props);

        //Datahandler saves and load data
        var dh = new Datahandler();
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
                sumKm += Number.parseFloat(this.tableDataLastDays[i][1]);
                //Sum of all values in the third column (Height)
                sumHm += Number.parseInt(this.tableDataLastDays[i][2])
                //Sum of all values in the fourth column (Time)
                var str = this.tableDataLastDays[i][3] + '';
                const values = str.split(':');
                sumTime += values[0] * 60 + values[1] * 1000;
            }
            //calculate average Distance, Height and time and cut the decimal places
            const avgKm = (sumKm / this.tableDataLastDays.length).toFixed(3);
            const avgHm = (sumHm / this.tableDataLastDays.length).toFixed(0);
            const avgTime = sumTime / this.tableDataLastDays.length;

            this.tableDateAverage = [avgKm, avgHm, this.millisToMinutesAndSeconds(avgTime), ((avgTime/1000/60) / avgKm).toFixed(2)];

            //rerender the view cuz retrieving of data is delayed
            this.forceUpdate();
        }); 
    }

    millisToMinutesAndSeconds(millis) {
      //convert milliseconds in format mm:ss
      //https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      //Answer from maerics
      var minutes = Math.floor(millis / 60000);
      var seconds = ((millis % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    getTabelData(td) {
      //generate 2 dimensinal array with the table data and returns it
      var tableData = [];
      for (let i = 0; i < td.length; i++) {
        tableData.push([td[i].date, (td[i].distance / 1000).toFixed(3), td[i].height, this.millisToMinutesAndSeconds(td[i].time), ((td[i].time/1000/60) / (td[i].distance / 1000)).toFixed(2)]);
      }

      return tableData;
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

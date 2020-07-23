import AsyncStorage from '@react-native-community/async-storage';

let storageKey = 'data';      //key for asyncstorage
const MAX_LENGTH = 7;         //count of shown tracked activitys
var lastDays = [];            //storage for tracked activitys

export default class Datahandler {

    storeData = async (value) => {
        try {
          //read current saved
          //put new activity on position 0
          //remove last activity if list is full
          //save in asyncstorage
          const jsonValue = JSON.stringify(value);
          this.getLastDays().then(async (data) => {
            data.unshift(value);
            if (data.length > MAX_LENGTH) {
              data.pop();
            }
            await AsyncStorage.setItem(storageKey, JSON.stringify(data));
          });

        } catch (e) {
          // saving error
          console.log('Data Write Error')
        }
      }

    getData = async () => {
        try {
          //read activitys from asyncstorage
          //put them in lastDays array
          var jsonValue = await AsyncStorage.getItem(storageKey);
          jsonValue = JSON.parse(jsonValue);
          for (let i = 0; i < jsonValue.length; i++) {
            lastDays[i] = jsonValue[i];
          }
        } catch(e) {
            // error reading value
            console.log('Data Read Error')
        }
    }

    async getLastDays() {
      //call getData()
      //return filled lastDays array
      await this.getData();
      return lastDays;
    }

}

import AsyncStorage from '@react-native-community/async-storage';

let storageKey = 'data';
const MAX_LENGTH = 5;
var lastDays = [];

export default class Datahandler {

    storeData = async (value) => {
        try {
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
      await this.getData();
      return lastDays;
    }

}
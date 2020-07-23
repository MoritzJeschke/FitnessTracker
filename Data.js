export default class Data {
    //storing and handeling a tracked Activity (Date, Distance, Time, Height)
    date;
    distance;
    time;
    height;

    constructor(date, distance, time, height) {
        this.date = date;
        this.distance = distance;
        this.time = time;
        this.heigth = height;
    }
}
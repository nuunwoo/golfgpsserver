class Timer {
  date;
  year;
  month;
  day;
  hour;
  minute;
  second;
  millisecond;
  currentTime;

  // 초기값 세팅
  constructor() {
    this.date = new Date();
    this.year = "";
    this.month = "";
    this.day = "";
    this.hour = "";
    this.minute = "";
    this.second = "";
    this.millisecond = "";
    this.currentTime = "";
  }

  // 한 자리 수 앞 0 추가
  setDigit(num) {
    if (num < 10) return `0${num}`;
    else return `${num}`;
  }

  // 현재 시간 가져오기 ( yy-MM-dd H24:MI:SS.FF2 )
  getCurrentTime() {
    this.date = new Date();
    this.year = this.setDigit(this.date.getFullYear());
    this.month = this.setDigit(this.date.getMonth() + 1);
    this.day = this.setDigit(this.date.getDate());
    this.hour = this.setDigit(this.date.getHours());
    this.minute = this.setDigit(this.date.getMinutes());
    this.second = this.setDigit(this.date.getSeconds());
    this.millisecond = this.setDigit(this.date.getMilliseconds());

    this.currentTime = `${this.year}-${this.month}-${this.day} ${this.hour}:${
      this.minute
    }:${this.second}:${this.millisecond.slice(0, 2)}`;

    return this.currentTime;
  }
}

module.exports.timer = new Timer();

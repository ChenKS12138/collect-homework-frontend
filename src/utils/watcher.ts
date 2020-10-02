export class Watcher<T = any> {
  value: T;
  callBackQueue: Function[];
  constructor(initialValue: T) {
    this.value = initialValue;
    this.callBackQueue = [];
  }
  add(callback: (value: T) => void) {
    this.callBackQueue.push(callback);
  }
  update(value: T) {
    this.value = value;
    this.callBackQueue.forEach((cb) => {
      cb(value);
    });
  }
  cancel(callback: (value: T) => void) {
    this.callBackQueue = this.callBackQueue.filter((cb) => cb !== callback);
  }
}

const { EventEmitter } = require("events");

class Schedule extends EventEmitter {
  constructor(action, time) {
    super();
    this.action = action;
    this.handle = undefined;
    this.time = time;
    this.on("interval", action);
  }
  start() {
    if (!this.handle) {
      this.handle = setInterval(() => this.emit("interval"), this.time);
    }
  }
  stop() {
    if (this.handle) {
      clearInterval(this.handle);
      this.handle = undefined;
    }
  }
}

module.exports = Schedule;

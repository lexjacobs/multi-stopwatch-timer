function Stopwatch() {
  this.currentTimers = {};
  this.timerArchive = [];
}

Stopwatch.prototype.archive = function() {
  var archive = Object.assign({}, this.currentTimers);
  this.timerArchive.push(archive);
  this.currentTimers = {};
};

Stopwatch.prototype.createTimer = function(name) {
  this.currentTimers[name] = this.makeTimerObject();
};

Stopwatch.prototype.eachTimer = function(cb) {
  for (var timer in this.currentTimers) {
    cb(this.currentTimers[timer].times, timer, this.currentTimers);
  }
};

Stopwatch.prototype.getArchivedTimers = function() {
  return this.timerArchive;
};

Stopwatch.prototype.getCurrentNames = function() {
  return Object.keys(this.getCurrentTimers());
};

Stopwatch.prototype.getCurrentTimers = function() {
  return this.currentTimers;
};

Stopwatch.prototype.makeTimerObject = function() {
  return {
    times: [],
  };
};

Stopwatch.prototype.markTime = function(name, timestamp) {

  // throw new Error in case the name is omitted
  if (name === undefined) {
    throw new Error('timer name required');
  }

  // allow specific timestamp to be set
  // otherwise use current unix timecode
  if (timestamp === undefined) {
    timestamp = Date.now();
  }

  // create the timer if needed
  if (!this.timerExists(name)) {
    this.createTimer(name);
  }

  // push the timestamp (supplied, or generated) into the times array
  this.currentTimers[name].times.push(timestamp);

  // return the time elapsed since the last recordedTime, or null if it's the first entry
  var times = this.currentTimers[name].times;
  if (times.length === 1) {
    return null;
  } else {
    return timestamp - times[times.length - 2];
  }
};

Stopwatch.prototype.timerExists = function(name) {
  return this.currentTimers[name] !== undefined;
};

module.exports = Stopwatch;


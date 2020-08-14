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

Stopwatch.prototype.getArchivedTimers = function() {
  return this.timerArchive;
};

Stopwatch.prototype.getCurrentTimers = function() {
  return this.currentTimers;
};
Stopwatch.prototype.makeTimerObject = function() {
  return {
    recordedTimes: [],
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

  // push the timestamp (supplied, or generated) into the recordedTimes array
  var recordedTimes = this.currentTimers[name].recordedTimes;
  recordedTimes.push(timestamp);

  // return the time elapsed since the last recordedTime, or null if it's the first entry
  if (recordedTimes.length === 1) {
    return null;
  } else {
    return timestamp - recordedTimes[recordedTimes.length - 1];
  }
};

Stopwatch.prototype.timerExists = function(name) {
  return this.currentTimers[name] !== undefined;
};

module.exports = Stopwatch;


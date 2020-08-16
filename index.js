// var s = new Stopwatch('run1');
// s.markTime('timer1');
// ==> null
// s.markTime('timer1');
// ==> 1934
// s ==> {
//   timerArchive: [ {
//     name: 'run1',
//     timers: {
//       {
//         timer1: {
//           times: [ 1597610781647, 1597610783581  ]
//         }
//       }
//     }
//   }  ]
// }

function Stopwatch(name) {
  var currentTimers = this.createNewTimersObject(name);
  this.timerArchive = [];
  this.timerArchive.push(currentTimers);
}

Stopwatch.prototype.archive = function(name, previousName) {
  //  `name` refers to the *new* set of timers.
  //  `previousName` allows you to *rename* the set of timers
  //  that is now being archived.

  //  to archive the old timers, simply push
  //  a new timersObject into the `timerArchive`
  //  and future method invocations will reference the new object

  if (previousName !== undefined) {
    this.getCurrentTimers().name = previousName;
  }

  var newTimers = this.createNewTimersObject(name);
  this.timerArchive.push(newTimers);
};

Stopwatch.prototype.createNewTimersObject = function(name) {
  if (name === undefined) {
    name = null;
  }
  return {
    name: name,
    timers: {}
  };
};

Stopwatch.prototype.createSingleTimer = function(name) {
  this.getCurrentTimersTimers()[name] = this.createTimerObject(name);
};

Stopwatch.prototype.createTimerObject = function() {
  return {
    times: [],
  };
};

Stopwatch.prototype.eachTimer = function(cb) {
  var currentTimers = this.getCurrentTimersTimers();
  for (var timerName in currentTimers) {
    cb(currentTimers[timerName].times, timerName, currentTimers);
  }
};

Stopwatch.prototype.getCurrentNames = function() {
  return Object.keys(this.getCurrentTimersTimers());
};

Stopwatch.prototype.getCurrentTimers = function() {
  return this.getLastItem(this.timerArchive);
};

Stopwatch.prototype.getCurrentTimersTimers = function(name) {
  var currentTimersTimers = this.getLastItem(this.timerArchive);
  if (name !== undefined) {
    return currentTimersTimers.timers[name];
  } else {
    return currentTimersTimers.timers;
  }
};

Stopwatch.prototype.getFirstItem = function(arr) {
  return arr[0];
};

Stopwatch.prototype.getLastItem = function(arr) {
  return arr[arr.length - 1];
};

Stopwatch.prototype.getTimerArchive = function() {
  return this.timerArchive;
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
    this.createSingleTimer(name);
  }

  // push the timestamp (supplied, or generated) into the times array
  this.getCurrentTimersTimers(name).times.push(timestamp);

  // return the time elapsed since the last recordedTime, or null if it's the first entry
  var times = this.getCurrentTimersTimers(name).times;
  if (times.length === 1) {
    return null;
  } else {
    return timestamp - times[times.length - 2];
  }
};

Stopwatch.prototype.timerExists = function(name) {
  return this.getCurrentTimersTimers(name) !== undefined;
};

Stopwatch.prototype.timeLast = function(name) {
  if (!this.timerExists(name)) {
    throw new Error('no timer with this name exists');
  }
  var times = this.getCurrentTimersTimers(name).times;
  return this.getLastItem.call(this, times);
};

Stopwatch.prototype.timeStarted = function(name) {
  if (!this.timerExists(name)) {
    throw new Error('no timer with this name exists');
  }
  var times = this.getCurrentTimersTimers(name).times;
  return this.getFirstItem.call(this, times);
};

module.exports = Stopwatch;


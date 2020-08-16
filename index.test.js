const test = require('ava');
const Stopwatch = require('./index');

test.serial('a timer is started with markTime and a name', t => {
  var sw = new Stopwatch();
  var expected = {
    name: null,
    timers: {}
  };
  t.deepEqual(expected, sw.getCurrentTimers());
  sw.markTime('fizzy');
  t.notDeepEqual(expected, sw.getCurrentTimers());
});

test.serial('a new stopwatch instance with fresh currentTimers object is created with a new invocation', t => {
  var sw = new Stopwatch();
  t.deepEqual(sw.getCurrentTimers(), {
    name: null,
    timers: {}
  });
});

test('a timer requires a name', t => {
  var sw = new Stopwatch();
  t.throws(() => {
    sw.markTime();
  },{ message: 'timer name required' });
});

test('a stopwatch accepts a name and returns the elapsed time when supplying the same name', t => {
  var sw = new Stopwatch();
  t.deepEqual(sw.getCurrentTimers(), {
    name: null,
    timers: {}
  });
  sw.markTime('frog');
  var actual = sw.markTime('frog');
  t.true(actual >= 0);
});

test('a stopwatch will record laps when using `markTime` again', t => {
  var sw = new Stopwatch('ripe');
  t.deepEqual(sw.getCurrentTimers(), {
    name: 'ripe',
    timers: {}
  });
  sw.markTime('frog');
  sw.markTime('frog');
  t.not(sw.getCurrentTimers().timers.frog.times.length, 0);
});

test('timerExists determines if a named timer exists', t => {
  var sw = new Stopwatch();
  t.falsy(sw.timerExists('boink'));
  sw.markTime('boink');
  t.truthy(sw.timerExists('boink'));
});

test('markTime returns null when given its first timestamp', t => {
  var sw = new Stopwatch();
  var actual = sw.markTime('biff');
  t.is(actual, null);
});

test('a timer can be set with a user-provided timestamp', t => {
  var sw = new Stopwatch();
  sw.markTime('blam', 100);
  var actual = sw.markTime('blam', 150);
  t.is(actual, 50);
});

test('multiple timers can be tracked', t => {
  var sw = new Stopwatch();
  sw.markTime('star', 4);
  sw.markTime('planet', 1);
  sw.markTime('star', 8);
  sw.markTime('planet', 2);
  var actual = Object.keys(sw.getCurrentTimersTimers());
  t.is(actual.length, 2);
  t.truthy(actual.includes('star'));
  t.truthy(actual.includes('planet'));
});

test('timers can be archived and retrieved', t => {
  var sw = new Stopwatch();
  sw.markTime('star', 2);
  sw.markTime('planet', 0);
  sw.markTime('star', 4);
  sw.markTime('planet', 1);
  var current1 = sw.getCurrentTimers();
  sw.archive();
  sw.markTime('star1', 4);
  sw.markTime('planet1', 1);
  sw.markTime('star1', 8);
  sw.markTime('planet1', 2);
  var current2 = sw.getCurrentTimers();
  sw.archive();
  sw.markTime('star2', 8);
  sw.markTime('planet2', 2);
  sw.markTime('star2', 16);
  sw.markTime('planet2', 4);
  var current3 = sw.getCurrentTimers();
  sw.archive();

  var archived1 = sw.getTimerArchive()[0];
  var archived2 = sw.getTimerArchive()[1];
  var archived3 = sw.getTimerArchive()[2];
  t.deepEqual(current1, archived1);
  t.deepEqual(current2, archived2);
  t.deepEqual(current3, archived3);
});

test('all current timer names can be retrieved', t => {
  var sw = new Stopwatch();
  var actual = sw.getCurrentNames();
  t.deepEqual(actual, []);
  sw.markTime('arrow');
  sw.markTime('banana');
  sw.markTime('card');
  actual = sw.getCurrentNames();
  t.is(actual.length, 3);
  t.truthy(actual.includes('arrow'));
  t.truthy(actual.includes('banana'));
  t.truthy(actual.includes('card'));
});

test('timeStarted and timeLast methods will return the first/last values of a timer\'s times array', t => {
  var sw = new Stopwatch();
  sw.markTime('arrow', 142);
  sw.markTime('arrow', 150);
  sw.markTime('arrow', 190);
  sw.markTime('arrow', 212);
  sw.markTime('arrow', 242);
  t.is(sw.timeStarted('arrow'), 142);
  t.is(sw.timeLast('arrow'), 242);
  t.throws(() => {
    sw.timeStarted('albert');
  },{ message: 'no timer with this name exists' });
  t.throws(() => {
    sw.timeLast('albert');
  },{ message: 'no timer with this name exists' });
});

test('timeLast method will still return the first time if only 1 time has been marked', t => {
  var sw = new Stopwatch();
  sw.markTime('qbert', 138);
  t.is(sw.timeStarted('qbert'), 138);
  t.is(sw.timeLast('qbert'), 138);
});

test('a getFirstItem and getLastItem utility exists', t => {
  var sw = new Stopwatch();
  var times = [1, 2, 3, 4, 5];
  var actual = sw.getFirstItem(times);
  t.is(actual, 1);
  actual = sw.getLastItem(times);
  t.is(actual, 5);
});

test('a callback function can be applied to eachTimer', t => {
  var sw = new Stopwatch();
  sw.markTime('banana', 100);
  sw.markTime('banana', 150);
  sw.markTime('banana', 200);
  var allT = sw.getCurrentTimersTimers();
  sw.eachTimer((times, name, allTimers) => {
    t.deepEqual(times, [100, 150, 200]);
    t.deepEqual(name, 'banana');
    t.deepEqual(allTimers, allT);
  });
  sw.markTime('carbon', 110);
  sw.markTime('carbon', 250);
  sw.markTime('carbon', 350);
  sw.eachTimer((times, name) => {
    if (name === 'banana') {
      t.is(sw.timeStarted(name), 100);
      t.is(sw.timeLast(name), 200);
    }
    if (name === 'carbon') {
      t.is(sw.timeStarted(name), 110);
      t.is(sw.timeLast(name), 350);
    }
  });
});

test('createNewTimersObject makes the outer timer object with a supplied name, or null', t => {
  var actual = Stopwatch.prototype.createNewTimersObject();
  t.like(actual, {name: null, timers: {}});
  actual = Stopwatch.prototype.createNewTimersObject('roberto');
  t.like(actual, {name: 'roberto', timers: {}});
});

test('createTimerObject makes the inner single timer object as expected', t => {
  var actual = Stopwatch.prototype.createTimerObject('boffo');
  t.like(actual, { times: [] });
});

test('createSingleTimer adds a timer object as expected', t => {
  var sw = new Stopwatch();
  t.deepEqual(sw.getCurrentTimers(), {name: null, timers: {}});
  sw.createSingleTimer('abacaba');
  t.deepEqual(sw.getCurrentTimers(), {name: null, timers: {
    'abacaba': {
      times: []
    }
  }});
  sw.createSingleTimer('armadillo');
  t.deepEqual(sw.getCurrentTimers(), {name: null, timers: {
    'abacaba': {
      times: []
    },
    'armadillo': {
      times: []
    }
  }});
});

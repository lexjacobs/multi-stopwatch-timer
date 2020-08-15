const test = require('ava');
const Stopwatch = require('./index');

test.serial('a timer is started with markTime and a name', t => {
  var sw = new Stopwatch();
  t.deepEqual(sw.getCurrentTimers(), {});
  sw.markTime('fizzy');
  t.notDeepEqual(sw.getCurrentTimers(), {});
});

test.serial('a new stopwatch instance with fresh currentTimers object is created with a new invocation', t => {
  var sw = new Stopwatch();
  t.deepEqual(sw.getCurrentTimers(), {});
});

test('a timer requires a name', t => {
  var sw = new Stopwatch();
  t.throws(() => {
    sw.markTime();
  },{ message: 'timer name required' });
});

test('a stopwatch accepts a name and returns the elapsed time when supplying the same name', t => {
  var sw = new Stopwatch();
  t.deepEqual(sw.getCurrentTimers(), {});
  sw.markTime('frog');
  var actual = sw.markTime('frog');
  t.true(actual >= 0);
});

test('a stopwatch will record laps when using `markTime` again', t => {
  var sw = new Stopwatch();
  t.deepEqual(sw.getCurrentTimers(), {});
  sw.markTime('frog');
  sw.markTime('frog');
  t.not(sw.getCurrentTimers().frog.times.length, 0);
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
  var actual = Object.keys(sw.getCurrentTimers());
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

  var archived1 = sw.getArchivedTimers()[0];
  var archived2 = sw.getArchivedTimers()[1];
  var archived3 = sw.getArchivedTimers()[2];
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

test('started and last methods will return the first/last values of a timer\'s times array', t => {
  var sw = new Stopwatch();
  sw.markTime('arrow', 142);
  sw.markTime('arrow', 150);
  sw.markTime('arrow', 190);
  sw.markTime('arrow', 212);
  sw.markTime('arrow', 242);
  t.is(sw.started('arrow'), 142);
  t.is(sw.last('arrow'), 242);
  t.throws(() => {
    sw.started('albert');
  },{ message: 'no timer with this name exists' });
  t.throws(() => {
    sw.last('albert');
  },{ message: 'no timer with this name exists' });
});

test('last method will return the started time if only 1 time has been marked', t => {
  var sw = new Stopwatch();
  sw.markTime('qbert', 138);
  t.is(sw.started('qbert'), 138);
  t.is(sw.last('qbert'), 138);
});

test('a getFirst and getLast utility exists', t => {
  var sw = new Stopwatch();
  var times = [1, 2, 3, 4, 5];
  var actual = sw.getFirst(times);
  t.is(actual, 1);
  actual = sw.getLast(times);
  t.is(actual, 5);
});

test('a callback function can be applied to eachTimer', t => {
  var sw = new Stopwatch();
  sw.markTime('banana', 100);
  sw.markTime('banana', 150);
  sw.markTime('banana', 200);
  var allT = sw.getCurrentTimers();
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
      t.is(sw.started(name), 100);
    }
    if (name === 'carbon') {
      t.is(sw.started(name), 110);
    }
  });
});


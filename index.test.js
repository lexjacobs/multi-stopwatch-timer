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
  t.not(sw.getCurrentTimers().frog.recordedTimes.length, 0);
});


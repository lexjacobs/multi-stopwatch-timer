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
  sw.archive();
  sw.markTime('star1', 4);
  sw.markTime('planet1', 1);
  sw.markTime('star1', 8);
  sw.markTime('planet1', 2);
  sw.archive();
  sw.markTime('star2', 8);
  sw.markTime('planet2', 2);
  sw.markTime('star2', 16);
  sw.markTime('planet2', 4);

  var current = sw.getCurrentTimers();
  var archived1 = sw.getArchivedTimers()[0];
  var archived2 = sw.getArchivedTimers()[1];
  t.deepEqual(current, {star2: {times:[8, 16]}, planet2: {times: [2, 4]}});
  t.deepEqual(archived1, {star: {times:[2, 4]}, planet: {times: [0, 1]}});
  t.deepEqual(archived2, {star1: {times:[4, 8]}, planet1: {times: [1, 2]}});
  var currentKeys = Object.keys(current);
  var archivedKeys1 = Object.keys(archived1);
  var archivedKeys2 = Object.keys(archived2);
  t.is(currentKeys.length, 2);
  t.is(archivedKeys1.length, 2);
  t.is(archivedKeys2.length, 2);
  t.truthy(archivedKeys1.includes('star'));
  t.truthy(archivedKeys1.includes('planet'));
  t.truthy(archivedKeys2.includes('star1'));
  t.truthy(archivedKeys2.includes('planet1'));
  t.truthy(currentKeys.includes('star2'));
  t.truthy(currentKeys.includes('planet2'));
});


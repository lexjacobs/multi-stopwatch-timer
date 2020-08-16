# multi-stopwatch-timer
A utility that lets you start and stop multiple keyed timers, and perform calculations via callback functions.

in process...
```
test('a custom callback can be used to format each timer', t => {
  var sw = new Stopwatch();
  sw.markTime('banana', 100);
  sw.markTime('banana', 150);
  sw.markTime('banana', 200);
  sw.markTime('carbon', 110);
  sw.markTime('carbon', 250);
  sw.markTime('carbon', 350);
  sw.eachTimer((times, name) => {
    console.log(name + ':duration', sw.last(name) - sw.started(name));
  });
  t.pass();
});
```

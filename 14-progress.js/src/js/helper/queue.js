let queue = (function() {
  var pending = [];
  function next() {
    var fn = pending.shift();
    if (fn) {
      fn(next);
    }
  }
  return function(fn) {
    pending.push(fn);
    if (pending.length == 1) next();
  };
})();

export default queue;

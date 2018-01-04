let win = window;
let el = document.documentElement;
let body = document.body;
let e;

let config = {
  off: false,
  attribute: 'data-scrolldir',
  el: '',
  direction: 'down'
};

let tick = () => {
  console.log(e);
};

let handler = event => {
  e = event;
  return win.requestAnimationFrame(tick);
};

let scrolldir = options => {
  Object.assign(config, options);

  if (config.el && typeof config.el === 'string') {
    el = document.querySelector(config.el);
    if (!el) throw TypeError('el is not an element');
  }

  if (config.off === true) {
    el.setAttribute(config.attribute, 'off');
    return win.removeEventListener('scroll', handler);
  }

  if (
    config.attribute &&
    typeof config.attribute === 'string' &&
    config.direction &&
    typeof config.direction === 'string'
  ) {
    el.setAttribute(config.attribute, config.direction);
  }

  return win.addEventListener('scroll', handler);
};

window.scrolldir = scrolldir;
module.exports = scrolldir;

import mitt from 'mitt';
import { keycode, keyrev } from './keycode';

let emitter = mitt();

let hotkey = (key, callback) => {
  if (typeof key !== 'string') {
    throw new TypeError('key required String type');
  } else if (typeof callback !== 'function') {
    throw new TypeError('callback required function type');
  }

  key = key.replace(/\s/g, '').toLowerCase();
  emitter.on(key, callback);
};

let dispatch = event => {
  let key = event.keyCode;
  let name = keyrev[key];
  if (!name) throw new TypeError(`Unknown key: ${key}`);
  emitter.emit(name, { event, key, name });
};

window.addEventListener('keydown', dispatch);
hotkey.destroy = () => window.removeEventListener('keydown', dispatch);
window.hotkey = module.exports = hotkey;

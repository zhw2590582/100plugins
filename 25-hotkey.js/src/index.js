import mitt from 'mitt';
import { keycode, keyrev } from './keycode';

let emitter = mitt();

let hotkey = (key, callback) => {
  key = key.replace(/\s/g, '');
  emitter.on(key, callback);
};

let dispatch = e => {
  console.log('dispatch');
};

window.addEventListener('keydown', dispatch);
hotkey.destroy = () => window.removeEventListener('keydown', dispatch);
window.hotkey = module.exports = hotkey;
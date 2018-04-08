import { keycode, keyrev } from './keycode';

let listeners = [];

let hotkey = (key, callback) => {
  console.log('hotkey');
};

let dispatch = e => {
  console.log('dispatch');
};

window.addEventListener('keydown', dispatch);
hotkey.destroy = () => window.removeEventListener('keydown', dispatch);
window.hotkey = module.exports = hotkey;

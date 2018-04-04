import './index.scss';
import dom from './dom.js';

class Hotkey {
  constructor(options) {
    this.options = {
      ...Hotkey.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS() {
    return {

    };
  }

  _init() {
    console.log(this)
  }
}

window.Hotkey = Hotkey;
module.exports = Hotkey;
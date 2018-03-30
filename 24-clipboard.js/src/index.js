import './index.scss';
import dom from './dom.js';

class CLIPBOARD {
  constructor(options) {
    this.options = {
      ...CLIPBOARD.DEFAULTS,
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

window.CLIPBOARD = CLIPBOARD;
module.exports = CLIPBOARD;
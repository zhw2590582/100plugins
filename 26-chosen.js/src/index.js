import './index.scss';
import dom from './dom.js';

class Chosen {
  constructor(options) {
    this.options = {
      ...Chosen.DEFAULTS,
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

window.Chosen = Chosen;
module.exports = Chosen;
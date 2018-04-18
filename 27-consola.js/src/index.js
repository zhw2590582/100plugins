import './index.scss';
import dom from './dom.js';

class Consola {
  constructor(options) {
    this.options = {
      ...Consola.DEFAULTS,
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

window.Consola = Consola;
module.exports = Consola;
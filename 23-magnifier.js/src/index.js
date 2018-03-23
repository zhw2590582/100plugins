import './index.scss';
import dom from './dom.js';

class Magnifier {
  constructor(el, options) {
    this.options = {
      ...Magnifier.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS() {
    return {

    };
  }

  _init(){

  }

}

window.Magnifier = Magnifier;
module.exports = Magnifier;
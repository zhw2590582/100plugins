import './index.scss';
import dom from './dom.js';

class HoverParallax {
  constructor(options) {
    this.options = {
      ...HoverParallax.DEFAULTS,
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

window.HoverParallax = HoverParallax;
module.exports = HoverParallax;
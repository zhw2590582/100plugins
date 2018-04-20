import './index.scss';
import dom from './dom.js';

class DomInfo {
  constructor(options) {
    this.options = {
      ...DomInfo.DEFAULTS,
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

window.DomInfo = DomInfo;
module.exports = DomInfo;
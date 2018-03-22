import './index.scss';
import dom from './dom.js';

class Danmu {
  constructor(el = '.lottery', options) {
    this.options = {
      ...Danmu.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS() {
    return {

    };
  }

  _init(){
    console.log(this)
  }
}

window.Danmu = Danmu;
module.exports = Danmu;
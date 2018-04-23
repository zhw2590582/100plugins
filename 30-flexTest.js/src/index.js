import './index.scss';
import dom from './dom.js';

class FlexTest {
  constructor(options) {
    this.options = {
      ...FlexTest.DEFAULTS,
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

window.FlexTest = FlexTest;
module.exports = FlexTest;
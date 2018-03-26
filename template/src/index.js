import './index.scss';
import dom from './dom.js';

class {{className}} {
  constructor(options) {
    this.options = {
      ...{{className}}.DEFAULTS,
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

window.{{className}} = {{className}};
module.exports = {{className}};
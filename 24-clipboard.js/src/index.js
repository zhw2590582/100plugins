import './index.scss';
import dom from './dom.js';

class Clipboard {
  constructor(options) {
    this.options = {
      ...Clipboard.DEFAULTS,
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
  
  on(){
    
  }

  destroy(){

  }
}

window.Clipboard = Clipboard;
module.exports = Clipboard;
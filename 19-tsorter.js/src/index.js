import './index.scss';
import listen from './listener.js';

class Tsorter {
  constructor(el = '.table-container', options) {
    this.options = {
      ...Tsorter.DEFAULTS,
      ...options
    };

    this.config = {
      containerEl: el instanceof Element ? el : document.querySelector(el),
    };

    this._init()
  }

  static get DEFAULTS() {
    return {

    };
  }

  _init() {

  }

  /**
   * ================================== PRIVATE METHODS ==================================
   */


  /**
   * ================================== PUBLIC METHODS ==================================
   */


  /**
   * ================================== HELPER ==================================
   */



}

window.Tsorter = Tsorter;
module.exports = Tsorter;
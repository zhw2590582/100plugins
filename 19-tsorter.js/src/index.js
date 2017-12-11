import './index.scss';
import listen from './listener.js';

class Tsorter {
  constructor(el = '.tsorter', options) {
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
      sorters: [],
      default: '',
      update: new Function
    };
  }

  _init() {
    this.config.containerEl.classList.add('__tsorter__');
    
    console.log(this)
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
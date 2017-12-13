import './index.scss';
import listen from './listener.js';
import dom from './dom.js';

class OnePageScroll {
  constructor(el = '.page-container', options) {
    this.options = {
      ...OnePageScroll.DEFAULTS,
      ...options
    };

    this.config = {
      containerEl: el instanceof Element ? el : document.querySelector(el),
    };

    this._init();
  }

  static get DEFAULTS() {
    return {
      sectionContainer: "section",
      easing: "ease",
      animationTime: 1000,
      pagination: true,
      updateURL: false,
      keyboard: true,
      beforeMove: new Function,
      afterMove: new Function,
      loop: true
    };
  }

  _init() {
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

window.OnePageScroll = OnePageScroll;
module.exports = OnePageScroll;

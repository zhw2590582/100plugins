import './index.scss';

class Masonry {
  constructor(el = '.masonry-container', options) {
    this.options = {
      ...Masonry.DEFAULTS,
      ...options
    };

    this.config = {
      containerEl: el instanceof Element ? el : document.querySelector(el),
      listEl: []
    };

    this._init();
  }

  static get DEFAULTS() {
    return {

    };
  }

  _init() {
    this.config.listEl = [].slice.call(this.config.containerEl.children);
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

window.Masonry = Masonry;
module.exports = Masonry;
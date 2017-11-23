import './index.scss';

class Contextmenu {
  constructor(options) {
    this.options = {
      ...Contextmenu.DEFAULTS,
      ...options
    };

    this.config = {};

    this._init();
  }

  static get DEFAULTS() {
    return {};
  }

  _init() {
    console.log(this);
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

window.Contextmenu = Contextmenu;
module.exports = Contextmenu;
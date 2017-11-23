import './index.scss';

class PopMenu {
  constructor(options) {
    this.options = {
      ...PopMenu.DEFAULTS,
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

window.PopMenu = PopMenu;
module.exports = PopMenu;
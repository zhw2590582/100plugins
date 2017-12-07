import './index.scss';

class Tags {
  constructor(el = '.tags-container', options) {
    this.options = {
      ...Tags.DEFAULTS,
      ...options
    };

    this.config = {

    };

    this._init()
  }

  static get DEFAULTS() {
    return {

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

window.Tags = Tags;
module.exports = Tags;
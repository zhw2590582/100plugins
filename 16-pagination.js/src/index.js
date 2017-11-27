import './index.scss';

class Pagination {
  constructor(options) {
    this.options = {
      ...Pagination.DEFAULTS,
      ...options
    };

    this.config = {

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

window.Pagination = Pagination;
module.exports = Pagination;
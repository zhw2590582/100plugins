import './scss/index.scss';

class Lottery {
  constructor(options) {

    this.options = {
      ...Lottery.DEFAULTS,
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

window.Lottery = Lottery;
module.exports = Lottery;

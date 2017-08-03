import listen from 'good-listener';

class Parallax {
  constructor(options) {

    this.options = {
      ...Validate.DEFAULTS,
      ...options
    };

    this.config = {

    }


    this._init();

  }

  static get DEFAULTS() {
    return {

    };
  }

  _init(){

  }

}

window.Parallax = Parallax;
module.exports = Parallax;

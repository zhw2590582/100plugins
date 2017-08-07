class Typing {
  constructor(el = '.parallax', options) {
    this.options = {
      ...Typing.DEFAULTS,
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
}

window.Typing = Typing;
module.exports = Typing;

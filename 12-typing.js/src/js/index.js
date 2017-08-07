class Typing {
  constructor(el = '.typing', options) {
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
      strings: [''],
      typeSpeed: 100,
      backSpeed: 50,
      startDelay: 500,
      backDelay: 500,
      loop: false,
      showCursor: false,
      cursorChar: '',
      onFinished: new Function()
    };
  }

  _init() {
    console.log(this);
  }
}

window.Typing = Typing;
module.exports = Typing;

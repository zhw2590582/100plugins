class Typing {
  constructor(el = '.typing', options) {
    this.options = {
      ...Typing.DEFAULTS,
      ...options
    };

    this.config = {
      el: el instanceof Element ? el : document.querySelector(el),
      play: false,
      back: false,
      typingIndex: 0,
      stringsIndex: 0
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

  /**
  * ================================== HELPER ==================================
  */

  _wait(time) {
    return new Promise(resolve => setTimeout(resolve, time || 0));
  }
}

window.Typing = Typing;
module.exports = Typing;

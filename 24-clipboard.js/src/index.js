import Emitter from 'tiny-emitter';

class Clipboard extends Emitter {
  constructor(options) {
    super();

    this.options = {
      ...Clipboard.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS() {
    return {
      target: '',
      trigger: ''
    };
  }

  _init() {
    console.log(this);
  }

  on() {}

  destroy() {}
}

window.Clipboard = Clipboard;
module.exports = Clipboard;

class Progress {
  constructor(options) {
    this.options = {
      ...Progress.DEFAULTS,
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

  }

}

window.Progress = Progress;
module.exports = Progress;

<<<<<<< HEAD
module.exports = {
  a: 233
};
=======
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
>>>>>>> baf0a9b6157bf527e0ab27c8a9ebd857d4c74ef4

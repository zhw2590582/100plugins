class Typing {
  constructor(el = '.parallax', options) {
    this.options = {
      ...Typing.DEFAULTS,
      ...options
    };

    this.config = {

    };

    window.requestAnimFrame = (function() {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

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

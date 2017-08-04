import listen from 'good-listener';

class Parallax {
  constructor(el = '.parallax', options) {
    this.options = {
      ...Parallax.DEFAULTS,
      ...options
    };

    this.config = {
      state: false,
      screenHeight: window.innerHeight || 0,
      elems: [],
      elemsInit: []
    };

    this.options.speed = this._clamp(this.options.speed, -10, 10);

    let elements = document.querySelectorAll(el);
    if (elements.length > 0) {
      this.config.elems = [].slice.call(elements);
    } else {
      throw new Error(`The elements(${el}) you're trying to select don't exist.`);
    }

    this._init();
  }

  static get DEFAULTS() {
    return {
      speed: -2
    };
  }

  _init() {
    this._elemsInit();
    console.log(this);
  }

  _elemsInit(){
    
  }

  /**
  * ================================== HELPER ==================================
  */

  _loop() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(callback) {
        setTimeout(callback, 1000 / 60);
      }
    );
  }

  _transformProp() {
    return (
      window.transformProp ||
      (function() {
        var testEl = document.createElement('div');
        if (testEl.style.transform == null) {
          var vendors = ['Webkit', 'Moz', 'ms'];
          for (var vendor in vendors) {
            if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
              return vendors[vendor] + 'Transform';
            }
          }
        }
        return 'transform';
      })()
    );
  }

  _clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }
}

window.Parallax = Parallax;
module.exports = Parallax;

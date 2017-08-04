import listen from 'good-listener';

class Parallax {
  constructor(el = '.parallax', options) {
    this.options = {
      ...Parallax.DEFAULTS,
      ...options
    };

    this.config = {
      pause: false,
      posY: 0,
      transformProp: this._transformProp(),
      screenHeight: window.innerHeight || 0,
      elems: [],
      elemsInit: [],
      listeners: []
    };

    this.options.speed = this._clamp(this.options.speed, -10, 10);

    let elements = document.querySelectorAll(el);
    if (elements.length > 0) {
      this.config.elems = [].slice.call(elements);
    } else {
      throw new Error(
        `The elements(${el}) you're trying to select don't exist.`
      );
    }

    this._animate = this._animate.bind(this);

    this._init();
  }

  static get DEFAULTS() {
    return {
      speed: -2
    };
  }

  _init() {
    this._elemsInit();
    this._eventBind();
    console.log(this);
  }

  _elemsInit() {
    for (var i = 0; i < this.config.elems.length; i++) {
      var initInfo = this._createInit(this.config.elems[i]);
      this.config.elemsInit.push(initInfo);
    }
  }

  _createInit(el) {
    return {
      el: el,
      speed: +el.getAttribute('data-parallax-speed') || this.options.speed,
      top: el.getBoundingClientRect().top,
      height: el.clientHeight || el.offsetHeight || el.scrollHeight || 0
    };
  }

  _eventBind(){
    this._setPosition();
    window.addEventListener('resize', this._animate);
    this._update();
    this._animate();
  }

  _setPosition() {
    let oldY = this.config.posY;

    if (window.pageYOffset !== undefined) {
      this.config.posY = window.pageYOffset;
    } else {
      this.config.posY = (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    if (oldY != this.config.posY) {
      return true;
    }

    return false;
  }

  _animate(e){
    for (var i = 0; i < this.config.elems.length; i++){

    }
  }

  _update(){
    let time = 0;
    time++;
    console.log(time);
    if (this._setPosition() && this.config.pause === false) {
      this._animate();
    }

    this._loop(this._update);
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

  _listen(el, type, event) {
    this.config.listeners.push(listen(el, type, event));
  }

}

window.Parallax = Parallax;
module.exports = Parallax;

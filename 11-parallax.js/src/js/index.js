class Parallax {
  constructor(el = '.parallax', options) {
    this.options = {
      ...Parallax.DEFAULTS,
      ...options
    };

    this.config = {
      min: -10,
      max: 10,
      pause: false,
      posY: 0,
      transformProp: this._transformProp(),
      screenHeight: window.innerHeight || 0,
      elems: [],
      elemsInit: []
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

    this.options.speed = this._clamp(this.options.speed, this.config.min, this.config.max);

    let elements = document.querySelectorAll(el);
    if (elements.length > 0) {
      this.config.elems = [].slice.call(elements);
    } else {
      throw new Error(
        `The elements(${el}) you're trying to select don't exist.`
      );
    }

    this._animate = this._animate.bind(this);
    this._update = this._update.bind(this);

    this._init();
  }

  static get DEFAULTS() {
    return {
      speed: -2,
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
      speed: +el.getAttribute('data-parallax-speed') || this.options.speed,
      top: el.getBoundingClientRect().top,
      height: el.clientHeight || el.offsetHeight || el.scrollHeight || 0
    };
  }

  _eventBind() {
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
      this.config.posY = (document.documentElement ||
        document.body.parentNode ||
        document.body).scrollTop;
    }
    if (oldY != this.config.posY) {
      return true;
    }
    return false;
  }

  _updatePosition(percentage, speed) {
    return (speed * (100 * (1 - percentage)));
  };

  _animate(e) {
    for (let i = 0; i < this.config.elemsInit.length; i++) {
      let el = this.config.elemsInit[i];


      let percentage = ((this.config.posY - el.top + this.config.screenHeight) / (el.height + this.config.screenHeight));
      // let position = this._updatePosition(percentage, el.speed);

      this.config.elems[i].setAttribute('test', percentage);

      let position = this.config.posY * el.speed;

      let translate = 'translate3d(0,' + position + 'px,0)';
      this.config.elems[i].style[this.config.transformProp] = translate;
    }
  }

  _update() {
    if (this._setPosition() && this.config.pause === false) {
      this._animate();
    }
    window.requestAnimFrame(this._update);
  }

  /**
  * ================================== HELPER ==================================
  */

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

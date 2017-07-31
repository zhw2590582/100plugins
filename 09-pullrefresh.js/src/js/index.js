import listen from 'good-listener';

class Pullrefresh {
  constructor(options) {
    if (typeof options === 'undefined') {
      throw new TypeError('Pullrefresh required `options`.');
    } else if (typeof options.container === 'undefined') {
      throw new TypeError('Pullrefresh required `container` option.');
    }

    this.options = {
      ...Pullrefresh.DEFAULTS,
      ...options
    };

    if (this.options.container instanceof Element) {
      this.options.container = options.target;
    } else {
      this.options.container = document.querySelectorAll(
        this.options.container
      )[0];
    }

    this.listeners = {};
    this.config = {
      startX: 0,
      startY: 0,
    };

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);

    this._init();

  }

  static get DEFAULTS() {
    return {
      pullText: 'Pull down to refresh',
      dropText: 'Release to refresh',
      loadingText: 'Refreshing',
      distanceIndex: 2,
      loadDistance: 70,
      onLoad: new Function()
    };
  }

  _init() {
    if (!this._isMobile()) return;
    this._createDom();
    this._eventBind();
    console.log(this);
  }

  _createDom() {
    document.body.classList.add('__pr__wrap');
    this.options.container.classList.add('__pr__container');
    document.body.insertAdjacentHTML(
      'afterBegin',
      '<div class="__pr__symbol"><div class="__pr__msg">' +
        this.options.pullText +
      '</div></div>'
    );
    this.options.msgDom = document.querySelectorAll('.__pr__msg')[0];
  }

  _eventBind() {
    this.listeners._onTouchStart = listen(
      document.body,
      'touchstart',
      this._onTouchStart
    );
    this.listeners._onTouchMove = listen(
      document.body,
      'touchmove',
      this._onTouchMove
    );
    this.listeners._onTouchEnd = listen(
      document.body,
      'touchend',
      this._onTouchEnd
    );
  }

  _onTouchStart(e) {
    let targetEvent = e.changedTouches[0];
    this.config.startX = targetEvent.clientX;
    this.config.startY = targetEvent.clientY;
  }

  _onTouchMove(e) {
    let targetEvent = e.changedTouches[0];
    let x = targetEvent.clientX;
    let y = targetEvent.clientY;
    let diffX = x - this.config.startX;
    let diffY = y - this.config.startY;

    if(diffY > 0){
      this._onPullDownMove(this.config.startY, y);
    } else {

    }
    //console.log(diffX, diffY);
  }

  _onTouchEnd(e) {
    console.log(this);
  }

  _onPullDownMove(startY, y){
    //event.preventDefault();
    console.log(startY, y);
  }

  /**
  * ================================== PUBLIC METHODS ==================================
  */

  destory() {
    Object.keys(this.listeners).map(listener => {
      this.listeners[listener].destroy();
    });
    document.body.classList.remove('__pr__wrap');
    this.options.container.classList.remove('__pr__container');
    this.options.symbolDom.innerHTML = '';
  }

  /**
  * ================================== HELPER ==================================
  */

  _isMobile() {
    return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
  }

  _wait(time) {
    return new Promise(resolve => setTimeout(resolve, time ? time * 1000 : 0));
  }

  _blur() {
    document.activeElement && document.activeElement.blur();
  }
}

window.Pullrefresh = Pullrefresh;
module.exports = Pullrefresh;

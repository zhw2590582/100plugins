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

    this.listeners = [];
    this.config = {
      className: '__pr__',
      state: 'false',
      refreshDistance: 200,
      startX: 0,
      startY: 0
    };

    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._listen = this._listen.bind(this);


    this._init();
  }

  static get DEFAULTS() {
    return {
      pullText: 'Pull down to refresh',
      dropText: 'Release to refresh',
      loadingText: 'Refreshing',
      distanceIndex: 2,
      loadDistance: 70,
      onRefresh: new Function()
    };
  }

  _init() {
    if (!this._isMobile()) return;
    this._createDom();
    this._eventBind();
    console.log(this);
  }

  _createDom() {
    document.body.classList.add(this.config.className + 'wrap');
    this.options.container.classList.add(this.config.className + 'container');
    document.body.insertAdjacentHTML(
      'afterBegin',
      '<div class="' + this.config.className + 'symbol"><div class="' + this.config.className + 'msg"></div></div>'
    );
    this.config.symbolDom = document.querySelectorAll('.' + this.config.className + 'symbol')[0];
    this.config.msgDom = document.querySelectorAll('.' + this.config.className + 'msg')[0];
  }

  _eventBind() {
    this._listen(
      document.body,
      'touchstart',
      this._onTouchStart
    );
    this._listen(
      document.body,
      'touchmove',
      this._onTouchMove
    );
    this._listen(
      document.body,
      'touchend',
      this._onTouchEnd
    );
  }

  _onTouchStart(e) {
    this._setState('pulling');
    this.config.msgDom.textContent = this.options.pullText;
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
    this._onPullDownMove(this.config.startY, y);
  }

  _onTouchEnd(e) {
    this._setState('release');
    let targetEvent = e.changedTouches[0];
    let x = targetEvent.clientX;
    let y = targetEvent.clientY;
    let diffX = x - this.config.startX;
    let diffY = y - this.config.startY;
    if(diffY >= this.config.refreshDistance){
      this._onPullDownRefresh();
    } else {
      this._setChange(0);
    }
  }

  _onPullDownMove(startY, y) {
    event.preventDefault();
    if (this.config.state !== 'pulling') return false;
    let diff = y - startY < 0 ? 0 : y - startY;
    this._setChange(this._easing(diff));
  }

  _onPullDownRefresh(){
    this._setState('refresh');
    this.config.msgDom.textContent = this.options.loadingText;
    this._setChange(50);
    this._wait(1).then(() => {
      this._setChange(0);
      this._setState('reset');
      if (typeof this.options.onRefresh === "function") {
        this.options.onRefresh();
      }
    })
  }

  /**
  * ================================== PUBLIC METHODS ==================================
  */

  destory() {
    his.listeners.map(listener => {
      listener.destroy();
    });
    document.body.classList.remove('__pr__wrap');
    this.options.container.classList.remove('__pr__container');
    this.config.symbolDom.innerHTML = '';
  }

  /**
  * ================================== HELPER ==================================
  */

  _setChange(pullHeight) {
    let lbodyTop = pullHeight !== 0 ? 'translate3d(0, ' + pullHeight + 'px, 0)' : '';
    let symbolTop = pullHeight - 50 > 0 ? pullHeight - 50 : 0;
    let lSymbol = symbolTop !== 0 ? 'translate3d(0, ' + symbolTop + 'px, 0)' : '';
    this.options.container.style.WebkitTransform = lbodyTop;
    this.options.container.style.transform = lbodyTop;
    this.config.symbolDom.style.WebkitTransform = lSymbol;
    this.config.symbolDom.style.transform = lSymbol;
  }

  _setState(state){
    this.config.state = state;
    document.body.className = this.config.className + 'wrap';
    document.body.classList.add(this.config.className + state);
  }

  _easing(distance) {
    let t = distance;
    let b = 0;
    let d = screen.availHeight;
    let c = d / 2.5;
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

  _isMobile() {
    return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
  }

  _wait(time) {
    return new Promise(resolve => setTimeout(resolve, time ? time * 1000 : 0));
  }

  _blur() {
    document.activeElement && document.activeElement.blur();
  }

  _listen(el, type, event){
    this.listeners.push(listen(el, type, event));
  }
}

window.Pullrefresh = Pullrefresh;
module.exports = Pullrefresh;

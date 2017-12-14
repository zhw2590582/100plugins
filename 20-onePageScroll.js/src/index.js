import './index.scss';
import listen from './listener.js';
import dom from './dom.js';

class OnePageScroll {
  constructor(el = '.onepage-wrapper', options) {
    this.options = {
      ...OnePageScroll.DEFAULTS,
      ...options
    };

    this.config = {
      containerEl: el instanceof Element ? el : document.querySelector(el),
      sectionsEl: [],
      events: [],
      pageView: 1
    };

    this._scrollEvent = this._scrollEvent.bind(this);
    this._init();
  }

  static get DEFAULTS() {
    return {
      sectionContainer: 'section',
      easing: 'ease',
      animationTime: 1000,
      pagination: true,
      updateURL: false,
      keyboard: true,
      beforeMove: new Function(),
      afterMove: new Function(),
      loop: true
    };
  }

  _init() {
    this.config.containerEl.classList.add('onepage-wrapper');
    this.config.containerEl.style.position = 'relative';
    this.config.sectionsEl = dom.find(
      this.config.containerEl,
      this.options.sectionContainer
    );
    this.config.sectionsEl.map((el, index) => {
      el.classList.add('ops-section');
      el.setAttribute('data-index', index + 1);
    });
    this._eventBind();
    console.log(this);
  }

  /**
   * ================================== PRIVATE METHODS ==================================
   */

  _eventBind() {
    this.config.events[this.config.events.length] = listen(
      document,
      'mousewheel',
      this._scrollEvent
    );
    this.config.events[this.config.events.length] = listen(
      document,
      'DOMMouseScroll',
      this._scrollEvent
    );
  }

  _scrollEvent(event) {
    event.preventDefault();
    let delta = event.wheelDelta || -event.detail;
    let pos = this._getPos(delta);
    let transformCSS =
      '-webkit-transform: translate3d(0, ' +
      pos +
      '%, 0); -webkit-transition: -webkit-transform ' +
      this.options.animationTime +
      'ms ' +
      this.options.easing +
      '; -moz-transform: translate3d(0, ' +
      pos +
      '%, 0); -moz-transition: -moz-transform ' +
      this.options.animationTime +
      'ms ' +
      this.options.easing +
      '; -ms-transform: translate3d(0, ' +
      pos +
      '%, 0); -ms-transition: -ms-transform ' +
      this.options.animationTime +
      'ms ' +
      this.options.easing +
      '; transform: translate3d(0, ' +
      pos +
      '%, 0); transition: transform ' +
      this.options.animationTime +
      'ms ' +
      this.options.easing +
      ';';
    this.config.containerEl.style.cssText = transformCSS;

    let transitionEnd = this._whichTransitionEvent();
    let transitionEndEvent = listen(this.config.containerEl, transitionEnd, e => {
      if(typeof this.options.afterMove == 'function'){
        this.options.afterMove(this.config.pageView);
        transitionEndEvent.destroy();
      }
    });
  }

  _getPos(delta) {
    let scrolDown = Math.sign(delta) === -1;
    let pageSize = this.config.sectionsEl.length;
    if(typeof this.options.beforeMove == 'function'){
      this.options.beforeMove(this.config.pageView);
    }
    if (scrolDown) {
      if (this.config.pageView < pageSize) {
        this.config.pageView += 1;
      } else if (this.config.pageView === pageSize && this.options.loop) {
        this.config.pageView = 1;
      }
    } else {
      if (this.config.pageView === 1 && this.options.loop) {
        this.config.pageView = pageSize;
      } else if (1 < this.config.pageView) {
        this.config.pageView -= 1;
      }
    }
    this._activeClass();
    return this.config.pageView === 1 ? 0 : -((this.config.pageView - 1) * 100);
  }

  _activeClass(){
    this.config.sectionsEl.map(el => el.classList.remove('active'));
    this.config.sectionsEl[this.config.pageView].classList.add('active');
  }

  _whichTransitionEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  /**
   * ================================== PUBLIC METHODS ==================================
   */

  destroy() {
    this.config.events.map(event => event.destroy());
  }

  /**
   * ================================== HELPER ==================================
   */
}

window.OnePageScroll = OnePageScroll;
module.exports = OnePageScroll;

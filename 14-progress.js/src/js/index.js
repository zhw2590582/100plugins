class Progress {
  constructor() {
    this.options = {
      parent: 'body',
      speed: 300,
      delay: 500,
      template: '<div id="progress"><div class="bar"></div></div>',
    };

    this.config = {
      parent: null,
      progressDom: null,
      barDom: null,
      percent: 0,
      maxRandomStep: 5,
      overDelay: 1000,
      timer: null,
    }
  }

  /**
  * ================================== PRIVATE METHODS ==================================
  */

  _creatDom(){
    if(this._isRendered()) return;
    this.config.parent = document.querySelector(this.options.parent);
    this.config.parent.insertAdjacentHTML('beforeend', this.options.template);
    this.config.progressDom = document.getElementById('progress');
    this.config.barDom = this.config.progressDom.querySelector('.bar');
    this.config.barDom.style.transition = `all ${this.options.speed}ms ease`;
  }

  _isRendered(){
    return !!document.getElementById('progress');
  }

  _animate(percent = 0, type){
    !!type && (this.config.barDom.style.width = this.config.percent + '%');
    !!type && clearTimeout(this.config.timer);
    percent = this._clamp(percent, 0, 1) * 100;
    this.config.percent = type === 'set' ? percent : (this.config.percent + percent);
    this.config.percent += Math.floor(Math.random() * this.config.maxRandomStep + 1);
    this._update();
  }

  _update(){
    if(this.config.percent > 99) {
      clearTimeout(this.config.timer);
      this.config.barDom.style.width = '99%';
    } else {
      this.config.timer = window.setTimeout(() => {
        this.config.barDom.style.width = this.config.percent + '%';
        this._animate();
      }, this.options.delay);
    }
  }

  /**
  * ================================== PUBLIC METHODS ==================================
  */

  configure(options){
    this.options = {
      ...this.options,
      ...options
    };
  }

  start(){
    if(this._isRendered()) return;
    this._creatDom();
    this._animate();
  }

  set(percent){
    this._creatDom();
    this._animate(percent, 'set');
  }

  inc(percent){
    this._creatDom();
    this._animate(percent, 'inc');
  }

  done(){
    if(!this._isRendered()) return;
    clearTimeout(this.config.timer);
    this.config.barDom.style.width = '100%';
    this.config.progressDom.classList.add('hide');
    window.setTimeout(() => {
      this.config.percent = 0;
      this._removeElement(this.config.progressDom);
    }, 300);
  }

  /**
  * ================================== HELPER ==================================
  */

  _removeElement(el) {
    el && el.parentNode && el.parentNode.removeChild(el);
  }

  _clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  };

}

window.Progress = new Progress();
module.exports = new Progress();

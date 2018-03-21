import './index.scss';

class Lottery {
  constructor(el, options) {
    this.options = {
      ...Lottery.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS() {
    return {

    };
  }

  _init(){
    console.log(this);
  }

  prize(index){
    console.log(index);
    return this;
  }

  start(){
    return this;
  }

  disabled(){
    return this;
  }
}

window.Lottery = Lottery;
module.exports = Lottery;
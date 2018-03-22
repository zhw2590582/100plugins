import './index.scss';
import dom from './dom.js';

class Danmu {
  constructor(el, options) {
    this.options = {
      ...Danmu.DEFAULTS,
      ...options
    };

    this.containerEl = el instanceof Element ? el : document.querySelector(el),
    this.danmus = [];
    this.danmusEl = [];

    this._init();
  }

  static get DEFAULTS() {
    return {
      zIndex: 100,
      speed: 7000,
      color: "#FFFFFF",
      fontSize: [18, 24],
      opacity: "0.9",
      maxCountInScreen: 40,
      maxCountPerSec: 10
    };
  }

  _init(){
    dom.insertHtml(this.containerEl, 'beforeend', `<div class="__danmu__"></div>`);
    this.danmuEl = this.containerEl.querySelector('.__danmu__');
    this.danmuEl.style.zIndex = this.options.zIndex;
    this.danmuEl.style.opacity = this.options.opacity;
    console.log(this)
  }

  _play(danmuItem){
    dom.insertHtml(this.danmuEl, 'beforeend', `<div class="__danmu__item" id="id_${danmuItem.id}" style="
      font-size: ${this.options.fontSize[danmuItem.size]}px;
      color: ${danmuItem.color};
      text-shadow: ${danmuItem.border} 1px 0px 1px, ${danmuItem.border} 0px 1px 1px, ${danmuItem.border} 0px -1px 1px, ${danmuItem.border} -1px 0px 1px;
    ">${danmuItem.text}</div>`);
    let danmuItemEl = this.danmuEl.querySelector(`#id_${danmuItem.id}`);
    this.danmus.push(danmuItem);
    this.danmusEl.push(danmuItemEl);
  }

  _randomInt(){
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }

  start(){

  }

  pause(){

  }

  resume(){

  }

  stop(){

  }

  hide(){

  }

  show(){

  }

  clear(){

  }

  getTime(){

  }

  setTime(time){

  }

  opacity(opacity){
    this.danmuEl.style.opacity = opacity;
    return this;
  }

  send(danmu){
    let danmuItem = {
      ...danmu,
      data: new Date(),
      id: this._randomInt()
    }

    this._play(danmuItem);
    console.log(danmuItem)
  }
}

window.Danmu = Danmu;
module.exports = Danmu;
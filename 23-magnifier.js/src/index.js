import './index.scss';
import dom from './dom.js';

class Magnifier {
  constructor(options) {
    this.options = {
      ...Magnifier.DEFAULTS,
      ...options
    };

    this.targets = Array.from(document.querySelectorAll('[data-magnifier]')).map(target => ({
      target: target,
      img: null,
      tracker: null,
      zoom: null,
      loader: null,
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      imgLoaded: false
    }));
    
    this._targetHover = this._targetHover.bind(this);
    this._init();
  }

  static get DEFAULTS() {
    return {
      width: 250,
      height: 250,
      position: "right",
      margin: 20,
      titlePosition: "bottom",
      showTitle: true
    };
  }

  _init() {
    this.targets.forEach((item, index) => {
      item.target.addEventListener('mousemove', this._targetHover.bind(this, index), false);
    });
  }

  _targetHover(index, e) {
    let target = e.target.tagName === 'IMG' ? e.target.parentNode : e.target;
    let targetObj = this.targets[index];
    if(!target.getAttribute('data-magnifier-index')){
      target.setAttribute('data-magnifier-index', index);
      this._creatDom(target, index);
      targetObj.width = Number(dom.getStyle(targetObj.img, 'width').replace(/px/, ''));
      targetObj.height = Number(dom.getStyle(targetObj.img, 'height').replace(/px/, ''));
    };

    console.log(targetObj.width, targetObj.height);

    if(targetObj.imgLoaded){
      this._trackerEvent(target, index);
      this._zoomEvent(target, index);
    } else {
      targetObj.loader.style.display = 'block';
      this._loaderEvent(target, index, () => {
        targetObj.loader.style.display = 'none';
        this._trackerEvent(target, index);
        this._zoomEvent(target, index);
      });
    }
  }

  _creatDom(target, index){
    let targetObj = this.targets[index];
    dom.insertHtml(target, 'beforeend', `<div class="magnifier-tracker"></div>`);
    dom.insertHtml(target, 'beforeend', `<div class="magnifier-zoom"></div>`);
    dom.insertHtml(target, 'beforeend', `<div class="magnifier-loader"></div>`);
    targetObj.img = target.querySelector('img');
    targetObj.tracker = target.querySelector('.magnifier-tracker');
    targetObj.zoom = target.querySelector('.magnifier-zoom');
    targetObj.loader = target.querySelector('.magnifier-loader');
    console.log(this);
  }

  _trackerEvent(target, index){

  }

  _zoomEvent(target, index){

  }

  _loaderEvent(target, index, callback){

  }

  _imgLoad(image){
    const imageHasLoaded = (img) => !('naturalHeight' in img && img.naturalHeight + img.naturalWidth === 0) || img.width + img.height !== 0;    
    return new Promise((resolve, reject) => {
      if (image.complete) {
        if (!imageHasLoaded(image)) {
          return reject(image);
        }
        return resolve(image);
      }
      image.addEventListener('load', () => {
        if (imageHasLoaded(image)) {
          return resolve(image);
        }
        return reject(image);
      });
      image.addEventListener('error', () => {
        return reject(image);
      });
    });
  }

  destory(){
    this.targets.forEach(target => {
      target.removeEventListener('mousemove', this._targetHover, false);
    });
  }
}

window.Magnifier = Magnifier;
module.exports = Magnifier;
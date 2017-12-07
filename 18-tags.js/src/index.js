import './index.scss';
import listen from './listener.js';

class Tags {
  constructor(el = '.tags-container', options) {
    this.options = {
      ...Tags.DEFAULTS,
      ...options
    };

    this.config = {
      containerEl: el instanceof Element ? el : document.querySelector(el),
      addEl: null,
      inputEl: null,
      tags: [],
      events: []
    };

    this._init()
  }

  static get DEFAULTS() {
    return {
      default: [],
      closable: false,
      init: new Function,
      update: new Function
    };
  }

  _init() {
    this.config.containerEl.classList.add('__tags__');
    if(this.options.default.length > 0){
      let tagList = '';
      let i = -1;
      while(++i < this.options.default.length){
        tagList += `<span class="tag">${this.options.default[i]}${this.options.closable ? `<i data-role="remove"></i>` : ``}</span>`;
      }
      this.config.containerEl.insertAdjacentHTML('beforeend', tagList);
    }
    this.config.containerEl.insertAdjacentHTML('beforeend', `<span class="tag add">+ 新增标签</span><input class="tag input">`);
    this.config.addEl = this.config.containerEl.querySelector('.add');
    this.config.inputEl = this.config.containerEl.querySelector('.input');
    this.config.tags = this.options.default.slice();
    this.options.init.call(this, this.config.tags);
    this._eventBind();
    console.log(this)
  }

  /**
   * ================================== PRIVATE METHODS ==================================
   */

  _eventBind(){
    this.config.events[this.config.events.length] = listen(this.config.addEl, 'click', e => {
      this.config.containerEl.classList.add('add-tag');
      this.config.inputEl.focus();
    });
    this.config.events[this.config.events.length] = listen(this.config.inputEl, 'blur', e => {
      this.config.containerEl.classList.remove('add-tag');
      this._inputTag();
    });
    this.config.events[this.config.events.length] = listen(this.config.inputEl, 'keyup', e => {
      var code = e.charCode || e.keyCode;
      if(code === 13 || code === 9){
        this.config.containerEl.classList.remove('add-tag');
        this._inputTag();
      }
    });
  }

  _inputTag(){
    let value = this.config.inputEl.value.trim();
    if(!value || this.config.tags.includes(value)) return;
    this.config.tags.push(value);
    this.config.addEl.insertAdjacentHTML('beforebegin', `<span class="tag">${value}${this.options.closable ? `<i data-role="remove"></i>` : ``}</span>`);
    this.options.update.call(this, this.config.tags, value);
  }

  /**
   * ================================== PUBLIC METHODS ==================================
   */

  destory(){

  }

  /**
   * ================================== HELPER ==================================
   */


}

window.Tags = Tags;
module.exports = Tags;
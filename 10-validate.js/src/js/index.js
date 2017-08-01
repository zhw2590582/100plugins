import listen from 'good-listener';

class Validate {
  constructor(options) {
    if (typeof options === 'undefined') {
      throw new TypeError('Validate required `options`.');
    } else if (typeof options.container === 'undefined') {
      throw new TypeError('Validate required `container` Attributes.');
    }

    this.options = {
      ...Validate.DEFAULTS,
      ...options
    };

    if (this.options.container instanceof Element) {
      this.options.container = options.target;
    } else {
      this.options.container = document.querySelectorAll(this.options.container)[0];
    }

    this.config = {
      triggerType: ['blur', 'change'],
      rules: [],
      listeners: [],
      errorDom: {}
    }

    this._eventBind = this._eventBind.bind(this);

    this._init();

  }

  static get DEFAULTS() {
    return {
      errorMsg: {
        required: () => `This field is required.`,
        min: num => `This field must consist of at least ${num} characters`,
        max: num => `This field must consist of at most ${num} characters`,
      }
    };
  }

  _init(){
    this._getElement();
    this._validate();
    console.log(this);
  }

  _getElement(){
    this.config.rules = [].slice.call(this.options.container.querySelectorAll('[name]'));
  }

  _validate(){
    this.config.rules.map(item => {
      let rules = this.options.rules[item.name];
      rules && rules.map(rule => {
        if(!rule.trigger || this.config.triggerType.indexOf(rule.trigger) === -1){
          throw new TypeError(`Rule required 'trigger' Attributes: ${this.config.triggerType.join(',')}`);
        } else {
          this._eventBind(item, rule)
        }
      })
    })
  }

  _eventBind(item, rule){
    this._listen(item, rule.trigger, e => {

      if(rule.required){
        if(item.value === ''){
          this._errorMsg(item, rule.message || this.options.errorMsg.required());
          console.log(0);
        } else {
          this._removeError(item);
        }
      } else if (rule.min || rule.max) {
        if(item.value.length < rule.min){
          this._errorMsg(item, rule.message || this.options.errorMsg.min(rule.min));
          console.log(1);
        } else if (item.value.length > rule.max) {
          this._errorMsg(item, rule.message || this.options.errorMsg.max(rule.max));
          console.log(2);
        } else {
          this._removeError(item);
        }
      }

    });
  }

  _errorMsg(item, message){
    item.insertAdjacentHTML('afterEnd', `<label id="${item.name}-error" class="error" for="${item.name}">${message}</label>`);
    this.config.errorDom[item.name] = document.getElementById(`${item.name}-error`);
  }

  _removeError(item){
    if(this.config.errorDom[item.name]){
      this._removeDom(this.config.errorDom[item.name]);
      this.config.errorDom[item.name] = false;
    }
  }

  /**
  * ================================== PUBLIC METHODS ==================================
  */

  destory() {
    this.config.listeners.map(listener => {
      listener.destroy();
    });
  }

  /**
  * ================================== HELPER ==================================
  */

  _removeDom(el){
    el.parentNode.removeChild(el);
  }

  _listen(el, type, event) {
    this.config.listeners.push(listen(el, type, event));
  }

}

window.Validate = Validate;
module.exports = Validate;

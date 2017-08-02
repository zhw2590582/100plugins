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
      tabNames: ['input', 'select', 'textarea'],
      inputType: ['text', 'checkbox', 'radio', 'file', 'password'],
      ruleType: ['required', 'minlength', 'maxlength', 'min', 'max', 'regex'],
      rules: [],
      listeners: [],
      errorDom: {}
    }

    this._eventBind = this._eventBind.bind(this);

    this._init();

  }

  static get DEFAULTS() {
    return {
      itemParent: '',
      errorMsg: {
        required: () => `This field is required.`,
        minlength: num => `This field must consist of at least ${num} characters`,
        maxlength: num => `This field must consist of at most ${num} characters`,
        min: num => `Please enter a value greater than or equal to ${num}`,
        max: num => `Please enter a value less than or equal to ${num}`,
        regex: regex => `Please enter the value of the matching ${regex}`,
        isNaN: () => `This field is requires a number type`,
        function: () => `This field is requires a function type`
      }
    };
  }

  _init(){
    this._getElement();
    this._validate();
    console.log(this);
  }

  _getElement(){
    this.options.container.classList.add('__validate__form');
    this.config.rules = [].slice.call(this.options.container.querySelectorAll('[name]'));
  }

  _validate(){
    this.config.rules.map(item => {
      let rules = this.options.rules[item.name];
      rules && rules.map(rule => {
        if(!rule.trigger || this.config.triggerType.indexOf(rule.trigger) === -1){
          throw new TypeError(`Rule required 'trigger' Attributes: ${this.config.triggerType.join(',')}`);
        } else {
          this.config.tabNames.indexOf(item.tagName.toLowerCase()) !== -1 && this._eventBind(item, rule);
        }
      })
    })
  }

  _eventBind(item, rule){
    this._listen(item, rule.trigger, e => {

      console.log(item.value);

      if(rule.validator){
        if(typeof rule.validator !== 'function'){
          this._errorMsg(item, rule.message || this.options.errorMsg.function());
        } else {
          rule.validator(item.value, error => {
            if(error){
              this._errorMsg(item, error.message);
            } else {
              this._removeError(item);
            }
          })
        }
        return;
      }

      if(rule.required){
        if(item.value === ''){
          this._errorMsg(item, rule.message || this.options.errorMsg.required());
        } else {
          this._removeError(item);
        }
      } else if (rule.minlength || rule.maxlength) {
        if(this.config.errorDom[item.name]) return;
        if (item.value.length < rule.minlength){
          this._errorMsg(item, rule.message || this.options.errorMsg.minlength(rule.minlength));
        } else if (item.value.length > rule.maxlength) {
          this._errorMsg(item, rule.message || this.options.errorMsg.maxlength(rule.maxlength));
        } else {
          this._removeError(item);
        }
      } else if (rule.min || rule.max){
        if(this.config.errorDom[item.name]) return;
        if(isNaN(item.value)){
          this._errorMsg(item, this.options.errorMsg.isNaN());
        } else if (item.value < rule.min){
          this._errorMsg(item, rule.message || this.options.errorMsg.min(rule.min));
        } else if (item.value > rule.max) {
          this._errorMsg(item, rule.message || this.options.errorMsg.max(rule.max));
        } else {
          this._removeError(item);
        }
      } else if (rule.regex) {
        if(this.config.errorDom[item.name]) return;
        if(!new RegExp(rule.regex).test(item.value)){
          this._errorMsg(item, rule.message || this.options.errorMsg.regex(rule.regex));
        } else {
          this._removeError(item);
        }
      }

    });
  }

  _errorMsg(item, message){
    this._removeError(item);
    item.classList.add('error');
    item.classList.remove('valid');
    if(this.options.itemParent && this._closest(item, this.options.itemParent)){
      this._closest(item, this.options.itemParent).classList.add('parent-error');
      this._closest(item, this.options.itemParent).classList.remove('parent-valid');
      this._closest(item, this.options.itemParent).insertAdjacentHTML('beforeend', `<label id="${item.name}-error" class="error" for="${item.name}">${message}</label>`);
    } else {
      item.insertAdjacentHTML('afterEnd', `<label id="${item.name}-error" class="error" for="${item.name}">${message}</label>`);
    }
    this.config.errorDom[item.name] = this.options.container.querySelectorAll(`#${item.name}-error`)[0];
  }

  _removeError(item){
    if(this.config.errorDom[item.name]){
      item.classList.remove('error');
      item.classList.add('valid');
      if(this.options.itemParent && this._closest(item, this.options.itemParent)){
        this._closest(item, this.options.itemParent).classList.remove('parent-error');
        this._closest(item, this.options.itemParent).classList.add('parent-valid');
      }
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

  _closest(el, selector) {
    let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        break;
      }
      el = el.parentElement;
    }
    return el;
  }

  _removeDom(el){
    el.parentNode.removeChild(el);
  }

  _listen(el, type, event) {
    this.config.listeners.push(listen(el, type, event));
  }

}

window.Validate = Validate;
module.exports = Validate;

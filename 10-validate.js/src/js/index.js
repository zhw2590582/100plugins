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
    this._formSubmit = this._formSubmit.bind(this);

    this._init();

  }

  static get DEFAULTS() {
    return {
      itemParent: '',
      submitHandler: new Function(),
      rules: {},
      validators: {},
      errorMsg: {
        requiredMsg: () => `This field is required.`,
        minlengthMsg: num => `This field must consist of at least ${num} characters`,
        maxlengthMsg: num => `This field must consist of at most ${num} characters`,
        minMsg: num => `Please enter a value greater than or equal to ${num}`,
        maxMsg: num => `Please enter a value less than or equal to ${num}`,
        regexMsg: regex => `Please enter the value of the matching ${regex}`,
        isNaNMsg: () => `This field is requires a number type`,
        functionMsg: () => `This field is requires a function type`
      }
    };
  }

  _init(){
    this._getElement();
    this._createRules();
    this._validate();
    this._formSubmit();
    console.log(this);
  }

  _getElement(){
    this.options.container.classList.add('__validate__form');
    this.config.rules = [].slice.call(this.options.container.querySelectorAll('[name]'));
  }

  _createRules(){
    let rules = {};
    this.config.rules.map(item => {
      rules[item.name] = [];
      if(item.required){
        rules[item.name].push({
          required: true,
          message: item.getAttribute("requiredmsg") || '',
          trigger: item.getAttribute("trigger") || ''
        })
      }

      if (!!item.getAttribute("minLength") || !!item.getAttribute("maxLength")) {
        rules[item.name].push({
          minlength: +item.getAttribute("minLength") || '',
          maxlength: +item.getAttribute("maxLength") || '',
          message: item.getAttribute("lengthmsg") || '',
          trigger: item.getAttribute("trigger") || ''
        })
      }

      if (!!item.getAttribute("min") || !!item.getAttribute("max")) {
        rules[item.name].push({
          min: +item.getAttribute("min") || '',
          max: +item.getAttribute("max") || '',
          message: item.getAttribute("nummsg") || '',
          trigger: item.getAttribute("trigger") || ''
        })
      }

      if (!!item.getAttribute("regex")) {
        rules[item.name].push({
          regex: new RegExp(item.getAttribute("regex")) || '',
          message: item.getAttribute("regexmsg") || '',
          trigger: item.getAttribute("trigger") || ''
        })
      }

      if(!!item.getAttribute("validator") && !!this.options.validators[item.getAttribute("validator")]){
        rules[item.name].push({
          validator: this.options.validators[item.getAttribute("validator")] || '',
          trigger: item.getAttribute("trigger") || ''
        })
      }

      if(item.type.toLowerCase() === 'radio' || item.type.toLowerCase() === 'checkbox'){

      }

    });

    console.log(rules);
  }

  _validate(submit){
    this.config.rules.map(item => {
      let rules = this.options.rules[item.name];
      this.config.tabNames.indexOf(item.tagName.toLowerCase()) !== -1 && rules && rules.map(rule => {
        if(!rule.trigger || this.config.triggerType.indexOf(rule.trigger) === -1){
          throw new TypeError(`Rule required 'trigger' Attributes: ${this.config.triggerType.join(',')}`);
        } else {
          this._eventBind(item, rule, submit);
        }
      })
    })
  }

  _eventBind(item, rule, submit){
    let _event = e => {
      if(rule.validator){
        if(typeof rule.validator !== 'function'){
          this._errorMsg(item, rule.message || this.options.errorMsg.functionMsg());
        } else {
          let errorFn = error => {
            if(error){
              this._errorMsg(item, error.message);
            } else {
              this._removeError(item);
            }
          }
          if(item.type.toLowerCase() === 'checkbox'){
            let checkboxValue = this.config.rules.filter(inputDom => {
              return inputDom.name === item.name
            }).filter(checkboxDom => {
              return checkboxDom.checked
            }).map(check => check.value);
            rule.validator(checkboxValue, errorFn);
          } else if (item.type.toLowerCase() === 'radio') {
            let radioValue = this.config.rules.filter(inputDom => {
              return inputDom.name === item.name
            }).filter(radioDom => {
              return radioDom.checked
            })[0];
            if(radioValue){
              rule.validator(radioValue.value, errorFn)
            } else {
              rule.validator('', errorFn)
            }
          } else {
            rule.validator(item.value, errorFn)
          }
        }
        return;
      }

      if(rule.required){
        if(item.value === ''){
          this._errorMsg(item, rule.message || this.options.errorMsg.requiredMsg());
        } else {
          this._removeError(item);
        }
      } else if (rule.minlength || rule.maxlength) {
        if(this.config.errorDom[item.name]) return;
        if (item.value.length < rule.minlength){
          this._errorMsg(item, rule.message || this.options.errorMsg.minlengthMsg(rule.minlength));
        } else if (item.value.length > rule.maxlength) {
          this._errorMsg(item, rule.message || this.options.errorMsg.maxlengthMsg(rule.maxlength));
        } else {
          this._removeError(item);
        }
      } else if (rule.min || rule.max){
        if(this.config.errorDom[item.name]) return;
        if(isNaN(item.value)){
          this._errorMsg(item, this.options.errorMsg.isNaNMsg());
        } else if (item.value < rule.min){
          this._errorMsg(item, rule.message || this.options.errorMsg.minMsg(rule.min));
        } else if (item.value > rule.max) {
          this._errorMsg(item, rule.message || this.options.errorMsg.maxMsg(rule.max));
        } else {
          this._removeError(item);
        }
      } else if (rule.regex) {
        if(this.config.errorDom[item.name]) return;
        if(!new RegExp(rule.regex).test(item.value)){
          this._errorMsg(item, rule.message || this.options.errorMsg.regexMsg(rule.regex));
        } else {
          this._removeError(item);
        }
      }
    }

    submit && _event() || this._listen(item, rule.trigger, _event);
  }

  _errorMsg(item, message){
    this._removeError(item);
    if(item.type.toLowerCase() !== 'checkbox'){
      item.classList.add('error');
      item.classList.remove('valid');
    }
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
    if(item.type.toLowerCase() !== 'checkbox'){
      item.classList.remove('error');
      item.classList.add('valid');
    }
    if(this.options.itemParent && this._closest(item, this.options.itemParent)){
      this._closest(item, this.options.itemParent).classList.remove('parent-error');
      this._closest(item, this.options.itemParent).classList.add('parent-valid');
    }
    if(this.config.errorDom[item.name]){
      this._removeDom(this.config.errorDom[item.name]);
      this.config.errorDom[item.name] = false;
    }
  }

  _formSubmit(){
    this._listen(this.options.container, 'submit', e => {
      e.preventDefault();
      this._validate(true);
      let flag = Object.keys(this.config.errorDom).every(item => {
        return this.config.errorDom[item] === false
      });
      flag && this.options.submitHandler(this.options.container);
    })
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

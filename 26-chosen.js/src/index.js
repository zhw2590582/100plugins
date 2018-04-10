import './index.scss';
import dom from './dom';
import error from './error';

class Chosen {
  constructor(el, options) {
    this.options = {
      ...Chosen.DEFAULTS,
      ...options
    };

    this.listeners = [];
    this.selected = [];
    this._selectClick = this._selectClick.bind(this);
    this._optionClick = this._optionClick.bind(this);
    this._searchChange = this._searchChange.bind(this);
    this._selectedDelClick = this._selectedDelClick.bind(this);
    this._deselectClick = this._deselectClick.bind(this);
    this._init();
  }

  static get DEFAULTS() {
    return {
      search: true,
      no_results: "No Results!",
      max_selected: null,
      deselect: false
    };
  }

  _init() {
    this._creatDom();
    this._eventBind();
    console.log(this);
  }

  _creatDom() {

  }

  _eventBind() {
    
  }

  _selectClick(){

  }

  _optionClick(){

  }

  _searchChange(){

  }

  _selectedDelClick(){

  }

  _deselectClick(){

  }

  _triggerChange(){
    this.listeners.forEach(cb => cb(this.selected));
    return this;
  }

  change(callback) {
    error(typeof callback !== 'function', 'The change function parameter required function type, but get ' + typeof callback);
    this.listeners.push(callback);
    return this;
  }

  destroy(){

  }
}

window.Chosen = Chosen;
module.exports = Chosen;
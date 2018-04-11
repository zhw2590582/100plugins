import './index.scss';
import dom from './dom';
import error from './error';

class Chosen {
  constructor(el, options) {
    this.options = {
      ...Chosen.DEFAULTS,
      ...options,
      placeholder: '',
      multiple: false,
      original_width: 0
    };

    this.selectEl = el instanceof Element ? el : document.querySelector(el);
    this.optionEl = Array.from(this.selectEl.querySelectorAll('option'));
    this.optionsArr = [];
    this.listeners = [];
    this.selected = [];
    this._selectClick = this._selectClick.bind(this);
    this._resultsClick = this._resultsClick.bind(this);
    this._resultsMouseover = this._resultsMouseover.bind(this);
    this._searchChange = this._searchChange.bind(this);
    this._selectedDelClick = this._selectedDelClick.bind(this);
    this._deselectClick = this._deselectClick.bind(this);
    this._init();
  }

  static get DEFAULTS() {
    return {
      search: true,
      no_results: 'No Results!',
      max_selected: null,
      deselect: false,
      width: null
    };
  }

  _init() {
    this.options.original_width = dom.getStyle(this.selectEl, 'width', true);
    this.selectEl.style.display = 'none';
    this.optionsArr = this.optionEl.map((option, index) => ({
      index: index,
      text: option.textContent,
      vaule: option.value
    }));
    this.options.placeholder = this.selectEl.dataset.placeholder;
    this.options.multiple = this.selectEl.multiple;
    this._creatDom();
    this._eventBind();
    console.log(this);
  }

  _creatDom() {
    let width = this.options.width ? this.options.width : this.options.original_width + 'px';
    let htmlStr = `
      <div class="chosen-container ${
        this.options.multiple
          ? 'chosen-container-multi'
          : 'chosen-container-single'
      }" style="width: ${width};">
        ${
          this.options.multiple
            ? `
          <ul class="chosen-choices">
            <li class="search-field">
              <input class="chosen-search-input default" type="text" autocomplete="off" value="${
                this.options.placeholder
              }">
            </li>
          </ul>
          `
            : `
          <a class="chosen-single chosen-default">
            <input class="chosen-search-input" type="text" autocomplete="off">
            <span>${this.options.placeholder}</span>
            <div><b></b></div>
          </a>
        `
        }
        <div class="chosen-drop">
          ${
            !this.options.multiple && this.options.search
              ? '<div class="chosen-search"><input type="text" autocomplete="off" /></div>'
              : ''
          }
          <ul class="chosen-results"></ul>
        </div>
      </div>
    `;
    dom.insertHtml(this.selectEl, 'afterend', htmlStr);
    this.containerEl = this.selectEl.nextElementSibling;
    this.resultsEl = this.containerEl.querySelector('.chosen-results');
    this.singleEl = this.containerEl.querySelector('.chosen-single');
    this.multipleEl = this.containerEl.querySelector('.chosen-choices');
    this.searchEl = this.containerEl.querySelector('.chosen-drop input');
  }

  _eventBind() {
    this[this.options.multiple ? 'multipleEl' : 'singleEl'].addEventListener('click', this._selectClick);
    if (this.resultsEl.children.length === 0) {
      let liStr = this.optionsArr.map((item, index) => {
        return `<li class="active-result" data-option-array-index="${index}" style="">${item.text}</li>`;
      }).join('');
      dom.insertHtml(this.resultsEl, 'beforeend', liStr);
      this.resultsChildrenEl = Array.from(this.resultsEl.children);
      dom.addClass(this.resultsEl.children[0], 'highlighted');
    }
    this.resultsEl.addEventListener('mouseover', this._resultsMouseover);
    this.resultsEl.addEventListener('click', this._resultsClick);
    return this;
  }

  _resultsUpdate() {
    this.resultsEl.innerHTML = '';
    // 
  }

  _selectClick() {
    if (dom.hasClass(this.containerEl, 'chosen-container-active')) {
      this._openDrop(false);
    } else {
      this._openDrop(true);
    }
    return this;
  }

  _openDrop(type) {
    if (type) {
      dom.addClass(this.containerEl, 'chosen-with-drop');
      dom.addClass(this.containerEl, 'chosen-container-active');
      this.searchEl.focus();
      this.selected.forEach(item => {
        dom.addClass(this.resultsEl.children[item.index], 'highlighted');
      });
    } else {
      dom.removeClass(this.containerEl, 'chosen-with-drop');
      dom.removeClass(this.containerEl, 'chosen-container-active');
      this.resultsChildrenEl.forEach(item => {
        dom.removeClass(item, 'highlighted');
      });
    }
  }

  _resultsClick(e) {
    let target = e.target;
    if (target.nodeName.toLowerCase() == 'li') {
      let index = target.dataset.optionArrayIndex;
      if (this.options.multiple) {
        // Todo
      } else {
        this.selected = [this.optionsArr[index]];
      }
      this._openDrop(false);
    }
  }

  _resultsMouseover(e) {
    let target = e.target;
    if (target.nodeName.toLowerCase() == 'li') {
      this.resultsChildrenEl.forEach(item => {
        dom.removeClass(item, 'highlighted');
      });
      dom.addClass(target, 'highlighted');
    }
  }

  _searchChange() {
    //
  }

  _selectedDelClick() {
    //
  }

  _deselectClick() {
    //
  }

  _triggerChange() {
    this.listeners.forEach(cb => cb(this.selected));
    return this;
  }

  change(callback) {
    error(
      typeof callback !== 'function',
      `The change function parameter required function type, but get ${typeof callback}`
    );
    this.listeners.push(callback);
    return this;
  }

  destroy() {}
}

window.Chosen = Chosen;
module.exports = Chosen;

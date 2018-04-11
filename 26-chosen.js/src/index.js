import './index.scss';
import dom from './dom';
import error from './error';

class Chosen {
  constructor(el, options) {
    this.options = {
      ...Chosen.DEFAULTS,
      ...options,
      placeholder: '',
      original_width: 0
    };

    this.selectEl = el instanceof Element ? el : document.querySelector(el);
    this.optionEl = Array.from(this.selectEl.querySelectorAll('option'));
    this.optionsArr = [];
    this.listeners = [];
    this._selectClick = this._selectClick.bind(this);
    this._resultsClick = this._resultsClick.bind(this);
    this._resultsMouseover = this._resultsMouseover.bind(this);
    this._searchChange = this._searchChange.bind(this);
    this._deselectClick = this._deselectClick.bind(this);
    this._init();
  }

  static get DEFAULTS() {
    return {
      search: true,
      no_results: 'Oops, nothing found!',
      deselect: false,
      width: null
    };
  }

  // 初始化
  _init() {
    this.options.original_width = dom.getStyle(this.selectEl, 'width', true);
    this.selectEl.style.display = 'none';
    this.optionsArr = this.optionEl.map((option, index) => ({
      selected: option.selected,
      disabled: option.disabled,
      index: index,
      text: option.textContent,
      vaule: option.value
    }));
    this.optionsArrCopy = [...this.optionsArr];
    this.options.placeholder = this.selectEl.dataset.placeholder;
    this._creatDom();
    this._defaultSelected();
    this._eventBind();
    console.log(this);
  }

  // 默认选择
  _defaultSelected() {
    let selected = this._getSelected();
    if (selected.length === 0) return;
    let index = selected[selected.length - 1].index;
    this._singleResults(index);
  }

  // 构建DOM
  _creatDom() {
    let width = this.options.width
      ? this.options.width
      : this.options.original_width + 'px';
    let htmlStr = `
      <div class="chosen-container chosen-container-single" style="width: ${width};">
        <a class="chosen-single chosen-default">
          <input class="chosen-search-input" type="text" autocomplete="off">
          <span>${this.options.placeholder}</span>
          <div><b></b></div>
        </a>
        <div class="chosen-drop">
          ${
            this.options.search
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
    this.singleResultsEl = this.containerEl.querySelector('.chosen-single span');
    this.singleSearchEl = this.containerEl.querySelector('.chosen-drop input');
  }

  // 事件绑定
  _eventBind() {
    this.singleEl.addEventListener('click', this._selectClick);
    this.resultsEl.addEventListener('mouseover', this._resultsMouseover);
    this.resultsEl.addEventListener('click', this._resultsClick);
    if (this.options.search) {
      this.singleSearchEl.addEventListener('input', this._searchChange);
    }
    return this;
  }

  // 更新搜索列表
  _resultsUpdate(keyword = '') {
    this.resultsEl.innerHTML = '';
    let optionsArr = keyword ? this._search(keyword) : this.optionsArr;
    let liStr = '';
    if (optionsArr.length === 0) {
      liStr = `<li class="no-results">${
        this.options.no_results
      } <span>${keyword}</span></li>`;
    } else {
      liStr = optionsArr
        .map((item, index) => {
          return `<li class="${
            item.disabled
              ? 'disabled-result'
              : `active-result ${item.selected ? 'result-selected' : ''}`
          }" data-option-array-index="${item.index}" style="">${
            item.text
          }</li>`;
        })
        .join('');
    }
    dom.insertHtml(this.resultsEl, 'beforeend', liStr);
    this.resultsChildrenEl = Array.from(this.resultsEl.children);
    return this;
  }

  _search(keyword) {
    keyword = keyword.toLowerCase().trim();
    return this.optionsArr.filter(item =>
      item.text.toLowerCase().includes(keyword)
    );
  }

  // 点击弹出列表
  _selectClick() {
    this._resultsUpdate();
    if (dom.hasClass(this.containerEl, 'chosen-container-active')) {
      this._openDrop(false);
    } else {
      this._openDrop(true);
    }
    return this;
  }

  // 弹出列表
  _openDrop(type) {
    let selected = this._getSelected();
    if (type) {
      dom.addClass(this.containerEl, 'chosen-with-drop');
      dom.addClass(this.containerEl, 'chosen-container-active');
      this.options.search && this.singleSearchEl.focus();
      if (selected.length === 0) return;
      selected.forEach(item => {
        dom.addClass(this.resultsEl.children[item.index], 'highlighted');
      });
    } else {
      dom.removeClass(this.containerEl, 'chosen-with-drop');
      dom.removeClass(this.containerEl, 'chosen-container-active');
      this.options.search && (this.singleSearchEl.value = '');
      this.resultsChildrenEl.forEach(item => {
        dom.removeClass(item, 'highlighted');
      });
    }
    return this;
  }

  // 点击列表
  _resultsClick(e) {
    let target = e.target;
    if (
      target.nodeName.toLowerCase() == 'li' &&
      !dom.hasClass(target, 'disabled-result')
    ) {
      let index = target.dataset.optionArrayIndex;
      this._singleResults(index);
      this._openDrop(false);
      this._triggerChange();
    }
  }

  // 点击列表-单选
  _singleResults(index) {
    this.optionsArr.forEach(item => (item.selected = false));
    this.optionsArr[index].selected = true;
    this.singleResultsEl.innerHTML = this.optionsArr[index].text;
    dom.removeClass(this.singleEl, 'chosen-default');
  }

  // 列表鼠标经过
  _resultsMouseover(e) {
    let target = e.target;
    if (
      target.nodeName.toLowerCase() == 'li' &&
      !dom.hasClass(target, 'disabled-result')
    ) {
      this.resultsChildrenEl.forEach(item => {
        dom.removeClass(item, 'highlighted');
      });
      dom.addClass(target, 'highlighted');
    }
  }

  _searchChange(e) {
    let keyword = e.target.value;
    this._resultsUpdate(keyword);
    return this;
  }

  _deselectClick() {
    //
  }

  _getSelected() {
    return this.optionsArr.filter(item => item.selected);
  }

  _triggerChange() {
    let selected = this._getSelected();
    this.listeners.forEach(cb => cb(selected));
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

  value() {
    return this._getSelected();
  }

  destroy() {
    this.selectEl.style.display = '';
    this.singleEl.removeEventListener('click', this._selectClick);
    this.resultsEl.removeEventListener('mouseover', this._resultsMouseover);
    this.resultsEl.removeEventListener('click', this._resultsClick);
    if (this.options.search) {
      this.singleSearchEl.removeEventListener('input', this._searchChange);
    }
    dom.removeElement(this.containerEl);
  }
}

window.Chosen = Chosen;
module.exports = Chosen;

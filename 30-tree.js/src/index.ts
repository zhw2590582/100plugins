interface Options {
  el: string;
  nodes?: Tree[];
  checkbox?: boolean;
  accordion?: boolean;
  onCheck?(e: MouseEvent, tree: Tree): void;
  onExpand?(e: MouseEvent, tree: Tree): void;
}

interface Tree {
  value: string;
  label: string;
  checked?: boolean;
  expanded?: boolean;
  children?: Tree[];
}

interface Configs extends Tree {
  target: HTMLElement;
}

import './index.scss';
import {
  insertHtml,
  removeElement,
  hasClass,
  toggleClass,
  removeClass,
  closest
} from './utils';

class Tree {
  private options: Options;
  private configs: Tree[];
  private containerEl: HTMLElement;
  private treeEl: HTMLElement;
  private checkedList: string[];

  private constructor(options: Options) {
    this.options = {
      ...Tree.DEFAULTS,
      ...options
    };

    this.checkedList = [];
    this.configs = [...this.options.nodes];
    this.containerEl = document.querySelector(options.el);
    this._eventBind = this._eventBind.bind(this);
    this._init();
  }

  static get DEFAULTS(): Options {
    return {
      el: '',
      nodes: [],
      checkbox: true,
      accordion: true,
      onCheck: function() {},
      onExpand: function() {}
    };
  }

  private _init(): this {
    this._creatDom();
    return this;
  }

  private _creatDom(): void {
    let self = this;
    let htmlStr = (function getStr(tree: Tree[]): string {
      return tree
        .map(item => {
          return `
          <li class="tree-parent${item.expanded ? ' expanded' : ''}">
            <div class="tree-text">
              ${
                item.children && item.children.length > 0
                  ? '<span class="tree-expanded">expanded</span>'
                  : ''
              }
              ${
                self.options.checkbox
                  ? `
                  <span class="tree-checked">
                    <input class="tree-checkbox" type="checkbox" value="${item.value}" ${
                      item.checked ? ' checked' : ''
                    }>
                  </span>
                  `
                  : ''
              }
              <span class="tree-label">${item.label}</span>
            </div>
            ${item.children ? `<ol> ${getStr(item.children)} </ol>` : ''}
          </li>
        `;
        })
        .join('');
    })(this.configs);
    insertHtml(
      this.containerEl,
      'beforeend',
      `<ol class="tree-el"> ${htmlStr} </ol>`
    );
    this.treeEl = this.containerEl.querySelector('.tree-el');
    this.treeEl.addEventListener('click', this._eventBind);
  }

  private _eventBind(e: MouseEvent): void {
    const target = e.target;
    if (hasClass(<Element>target, 'tree-expanded')) {
      this._expandedEvent(e);
    } else if (hasClass(<Element>target, 'tree-checkbox')) {
      this._checkedEvent(e);
    }
  }

  private _expandedEvent(e: MouseEvent): void {
    const target = closest(<Element>e.target, '.tree-parent');
    toggleClass(target, 'expanded');
    if (this.options.accordion) {
      const parent = closest(<Element>e.target, 'ol');
      Array.from(parent.children)
        .filter(children => children !== target)
        .forEach(tree => removeClass(tree, 'expanded'));
    }
  }

  private _checkedEvent(e: MouseEvent): void {
    const target = <HTMLInputElement>e.target;
    console.dir(target.value);
  }

  public setTree(tree: Tree[]): this {
    this.configs = tree;
    this.destroy()._init();
    return this;
  }

  public getChecked(): string[] {
    return this.checkedList;
  }

  public destroy(): this {
    this.containerEl.removeEventListener('click', this._eventBind);
    removeElement(this.treeEl);
    return this;
  }
}

(<any>window).Tree = Tree;
export default Tree;

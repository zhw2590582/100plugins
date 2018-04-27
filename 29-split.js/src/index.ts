interface Options {
  parent?: string;
  children?: string;
  onDragStart?(): void;
  onDragEnd?(): void;
}

interface Configs {
  parentEl: HTMLElement;
  childrenConfigs: ChildrenConfigs[];
  split: string;
  step: number;
  minSize: number;
  maxSize: number;
  defaultSize: number;
  resizerEl?: HTMLElement;
  cacheStyle?: string;
  move: boolean;
  cachePos?: {
    x: number;
    y: number;
  };
}

interface ChildrenConfigs {
  children: HTMLElement;
  subConfigs?: Configs | null;
  cacheStyle?: string;
}

import './index.scss';
import { setStyles, hasClass } from './utils';

class Split {
  private options: Options;
  private parentEl: HTMLElement;
  private configs: Configs;

  private constructor(options: Options = {}) {
    this.options = {
      ...Split.DEFAULTS,
      ...options
    };

    this.parentEl = document.querySelector(options.parent);
    this.configs = this._getConfigs(this.parentEl);
    this._mousedown = this._mousedown.bind(this);
    this._mousemove = this._mousemove.bind(this);
    this._mouseup = this._mouseup.bind(this);
    this._init();
  }

  static get DEFAULTS(): Options {
    return {
      parent: '.split-parent',
      children: '.split-children',
      onDragStart: function() {},
      onDragEnd: function() {}
    };
  }

  private _init(): void {
    if (!this.parentEl) {
      throw new TypeError(`Can't find dom element: options.parent`);
    }
    this._styleInit(this.configs);
    this._creatResizer(this.configs);
    this._eventBind(this.configs);
    console.log(this);
  }

  private _getConfigs(parentEl: HTMLElement): Configs {
    let children = Array.from(parentEl.children);
    if (children.length > 2) {
      children = children.slice(0, 2);
      console.warn(`Each split-parent can only contain up to 2 split-children`);
    }
    let childrenEl = children.filter(el =>
      hasClass(el, this.options.children.slice(1))
    );
    let defaultSize = Number(parentEl.dataset.defaultSize || 100);
    let split = ['vertical', 'horizontal'].includes(parentEl.dataset.split) ? parentEl.dataset.split : 'vertical';
    return {
      parentEl: parentEl,
      childrenConfigs: childrenEl.map((children: HTMLElement) => {
        let subChildren = Array.from(children.children);
        let subParentEl = subChildren.find(el =>
          hasClass(el, this.options.parent.slice(1))
        );
        return {
          children: children,
          subConfigs: subParentEl
            ? this._getConfigs(<HTMLElement>subParentEl)
            : null
        };
      }),
      minSize: Number(parentEl.dataset.minSize || 0),
      maxSize: Number(parentEl.dataset.maxSize || 0),
      defaultSize: defaultSize,
      split: split,
      step: Number(parentEl.dataset.step || 0),
      move: false,
      cachePos: {
        x: parentEl.dataset.split === 'vertical' ? defaultSize : 0,
        y: parentEl.dataset.split === 'horizontal' ? defaultSize : 0
      }
    };
  }

  private _styleInit(configs: Configs): void {
    configs.cacheStyle = configs.parentEl.getAttribute('style');
    setStyles(
      configs.parentEl,
      configs.split === 'vertical'
        ? {
            display: 'flex',
            flex: '1 1 0%',
            height: '100%',
            position: 'absolute',
            outline: 'none',
            overflow: 'hidden',
            userSelect: 'text',
            flexDirection: 'row',
            left: '0px',
            right: '0px'
          }
        : {
            display: 'flex',
            flex: '1 1 0%',
            height: '100%',
            position: 'absolute',
            outline: 'none',
            overflow: 'hidden',
            userSelect: 'text',
            bottom: '0px',
            flexDirection: 'column',
            minHeight: '100%',
            top: '0px',
            width: '100%'
          }
    );

    if (!configs.childrenConfigs) return;
    configs.childrenConfigs.forEach((item, index) => {
      item.cacheStyle = item.children.getAttribute('style');
      let isLast = index === configs.childrenConfigs.length - 1;
      setStyles(item.children, {
        flex: isLast ? '1 1 0%' : '0 0 auto',
        position: 'relative',
        outline: 'none',
        [configs.split === 'vertical' ? 'width' : 'height']: isLast
          ? 'auto'
          : configs.defaultSize + 'px'
      });
      item.subConfigs && this._styleInit(item.subConfigs);
    });
  }

  private _creatResizer(configs: Configs): void {
    if (!configs.childrenConfigs) return;
    configs.childrenConfigs.forEach((item, index) => {
      let isLast = index === configs.childrenConfigs.length - 1;
      if (!isLast) {
        let resizer = (configs.resizerEl = document.createElement('div'));
        resizer.setAttribute('class', `Resizer ${configs.split}`);
        this._after(item.children, resizer);
      }
      item.subConfigs && this._creatResizer(item.subConfigs);
    });
  }

  private _eventBind(configs: Configs): void {
    configs.resizerEl.addEventListener('mousedown', this._mousedown);
    configs.resizerEl.addEventListener('mousemove', this._mousemove);
    configs.resizerEl.addEventListener('mouseup', this._mouseup);
    if (!configs.childrenConfigs) return;
    configs.childrenConfigs.forEach(item => {
      item.subConfigs && this._eventBind(item.subConfigs);
    });
  }

  private _mousedown(e: MouseEvent): void {
    console.log('_mousedown');
  }

  private _mousemove(e: MouseEvent): void {
    console.log('_mousemove');
  }

  private _mouseup(e: MouseEvent): void {
    console.log('_mouseup');
  }

  private _after(target: Element, dom: Element): void {
    if (target.nextSibling) {
      target.parentNode.insertBefore(dom, target.nextSibling);
    } else {
      target.parentNode.appendChild(dom);
    }
  }

  public destroy(configs: Configs): void {
    configs.resizerEl.removeEventListener('mousedown', this._mousedown);
    configs.resizerEl.removeEventListener('mousemove', this._mousemove);
    configs.resizerEl.removeEventListener('mouseup', this._mouseup);
    setStyles(configs.parentEl, configs.cacheStyle);
    if (!configs.childrenConfigs) return;
    configs.childrenConfigs.forEach(item => {
      setStyles(item.children, item.cacheStyle);
      item.subConfigs && this.destroy(item.subConfigs);
    });
  }
}

(<any>window).Split = Split;
export default Split;

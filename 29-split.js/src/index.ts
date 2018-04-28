interface Options {
  parent?: string;
  children?: string;
  onDragStart?(): void;
  onDragEnd?(): void;
}

interface Config {
  parentEl: HTMLElement;
  childrenConfig: ChildrenConfig[];
  split: string;
  step: number;
  minSize: number;
  maxSize: number;
  defaultSize: number;
  resizerEl?: HTMLElement;
  cacheStyle: string | null;
  move: boolean;
  cachePos: {
    x: number;
    y: number;
  };
}

interface ChildrenConfig {
  childrenEl: Element;
  cacheStyle: string;
}

import './index.scss';
import { setStyles, hasClass } from './utils';

class Split {
  private options: Options;
  private parentEl: HTMLElement;
  private configs: Config[];

  private constructor(options: Options = {}) {
    this.options = {
      ...Split.DEFAULTS,
      ...options
    };

    this.parentEl = document.querySelector(options.parent);
    this.configs = [];
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
    this._getConfigs(this.parentEl);
    this.configs.forEach(config => {
      this._styleInit(config);
      this._creatResizer(config);
      this._eventBind(config);
    });
    console.log(this);
  }

  private _getConfigs(parentEl: HTMLElement): void {
    let children = Array.from(parentEl.children);
    if (children.length > 2) {
      children = children.slice(0, 2);
      console.warn(`Each split-parent can only contain up to 2 split-children`);
    }
    let childrenEl = children.filter(el =>
      hasClass(el, this.options.children.slice(1))
    );
    let defaultSize = Number(parentEl.dataset.defaultSize || 100);
    let split = ['vertical', 'horizontal'].includes(parentEl.dataset.split)
      ? parentEl.dataset.split
      : 'vertical';
    this.configs.push({
      parentEl: parentEl,
      childrenConfig: childrenEl.map(el => {
        return {
          childrenEl: el,
          cacheStyle: el.getAttribute('style')
        };
      }),
      minSize: Number(parentEl.dataset.minSize || 0),
      maxSize: Number(parentEl.dataset.maxSize || 0),
      defaultSize: defaultSize,
      split: split,
      step: Number(parentEl.dataset.step || 0),
      cacheStyle: parentEl.getAttribute('style'),
      move: false,
      cachePos: {
        x: parentEl.dataset.split === 'vertical' ? defaultSize : 0,
        y: parentEl.dataset.split === 'horizontal' ? defaultSize : 0
      }
    });

    // 递归并展平
    children.forEach(el => {
      let subParent = Array.from(el.children).find(subEl =>
        hasClass(subEl, this.options.parent.slice(1))
      );
      subParent && this._getConfigs(<HTMLElement>subParent);
    });
  }

  private _styleInit(configs: Config): void {
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

    if (!configs.childrenConfig) return;
    configs.childrenConfig.forEach((item, index) => {
      let isLast = index === configs.childrenConfig.length - 1;
      setStyles(item.childrenEl, {
        flex: isLast ? '1 1 0%' : '0 0 auto',
        position: 'relative',
        outline: 'none',
        [configs.split === 'vertical' ? 'width' : 'height']: isLast
          ? 'auto'
          : configs.defaultSize + 'px'
      });
    });
  }

  private _creatResizer(configs: Config): void {
    if (!configs.childrenConfig) return;
    configs.childrenConfig.forEach((item, index) => {
      let isLast = index === configs.childrenConfig.length - 1;
      if (!isLast) {
        let resizer = (configs.resizerEl = document.createElement('div'));
        resizer.setAttribute('class', `Resizer ${configs.split}`);
        this._after(item.childrenEl, resizer);
      }
    });
  }

  private _eventBind(configs: Config): void {
    configs.resizerEl.addEventListener('mousedown', this._mousedown);
    configs.resizerEl.addEventListener('mousemove', this._mousemove);
    configs.resizerEl.addEventListener('mouseup', this._mouseup);
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

  public destroy(): void {
    this.configs.forEach(config => {
      config.resizerEl.removeEventListener('mousedown', this._mousedown);
      config.resizerEl.removeEventListener('mousemove', this._mousemove);
      config.resizerEl.removeEventListener('mouseup', this._mouseup);
      config.parentEl.style.cssText = config.cacheStyle;
      if (!config.childrenConfig) return;
      config.childrenConfig.forEach(item => {
        let childrenEl = <HTMLElement>item.childrenEl;
        childrenEl.style.cssText = item.cacheStyle;
      });
    });
  }
}

(<any>window).Split = Split;
export default Split;

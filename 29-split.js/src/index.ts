interface Options {
  parent?: string;
  children?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  step?: number;
  onDragStart?(e: MouseEvent): void;
  onDragEnd?(e: MouseEvent): void;
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
  private containerEl: HTMLElement;
  private configs: Config[];
  private moveIndex: number;

  private constructor(options: Options = {}) {
    this.options = {
      ...Split.DEFAULTS,
      ...options
    };

    this.containerEl = document.querySelector(options.parent);
    this.configs = [];
    this.moveIndex = -1;
    this._mousedown = this._mousedown.bind(this);
    this._mousemove = this._mousemove.bind(this);
    this._mouseup = this._mouseup.bind(this);
    this._init();
  }

  static get DEFAULTS(): Options {
    return {
      parent: '.split-parent',
      children: '.split-children',
      defaultSize: 100,
      minSize: 10,
      maxSize: 1000,
      step: 0,
      onDragStart: function() {},
      onDragEnd: function() {}
    };
  }

  private _init(): void {
    if (!this.containerEl) {
      throw new TypeError(`Can't find dom element: options.parent`);
    }
    this._getConfigs(this.containerEl);
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

    let defaultSize = Number(parentEl.dataset.defaultSize || this.options.defaultSize) || 0;
    let minSize = Number(parentEl.dataset.minSize || this.options.minSize) || 0;
    let maxSize = Number(parentEl.dataset.maxSize || this.options.maxSize) || 0;
    let step = Number(parentEl.dataset.step || this.options.step) || 0;

    if(defaultSize < 0 || minSize < 0 || maxSize < 0 || step < 0){
      throw new TypeError(`defaultSize | minSize | maxSize | step: can't less than 0`);
    }

    if(minSize > maxSize){
      throw new TypeError(`minSize(${minSize}) can't greater than minSize(${maxSize})`);
    }

    if(minSize > defaultSize || maxSize < defaultSize){
      throw new TypeError(`defaultSize(${defaultSize}) can't less than minSize(${minSize}), or can't greater than maxSize(${maxSize})`);
    }

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
      minSize: minSize,
      maxSize: maxSize,
      defaultSize: defaultSize,
      split: split,
      step: this._clampNumber(step, 0, 100),
      cacheStyle: parentEl.getAttribute('style'),
      move: false,
      cachePos: {
        x: parentEl.dataset.split === 'vertical' ? defaultSize : 0,
        y: parentEl.dataset.split === 'horizontal' ? defaultSize : 0
      }
    });

    children.forEach(el => {
      let subParent = Array.from(el.children).find(subEl =>
        hasClass(subEl, this.options.parent.slice(1))
      );
      subParent && this._getConfigs(<HTMLElement>subParent);
    });
  }

  private _styleInit(config: Config): void {
    config.cacheStyle = config.parentEl.getAttribute('style');
    setStyles(
      config.parentEl,
      config.split === 'vertical'
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

    if (!config.childrenConfig) return;
    config.childrenConfig.forEach((item, index) => {
      let isLast = index === config.childrenConfig.length - 1;
      setStyles(item.childrenEl, {
        flex: isLast ? '1 1 0%' : '0 0 auto',
        position: 'relative',
        outline: 'none',
        [config.split === 'vertical' ? 'width' : 'height']: isLast
          ? 'auto'
          : config.defaultSize + 'px'
      });
    });
  }

  private _creatResizer(config: Config): void {
    if (!config.childrenConfig) return;
    config.childrenConfig.forEach((item, index) => {
      let isLast = index === config.childrenConfig.length - 1;
      if (!isLast) {
        let resizer = (config.resizerEl = document.createElement('div'));
        resizer.setAttribute('class', `Resizer ${config.split}`);
        this._after(item.childrenEl, resizer);
      }
    });
  }

  private _eventBind(config: Config): void {
    window.addEventListener('mousedown', this._mousedown);
    window.addEventListener('mousemove', this._mousemove);
    window.addEventListener('mouseup', this._mouseup);
  }

  private _mousedown(e: MouseEvent): void {
    this.moveIndex = this.configs.findIndex(
      config => config.resizerEl === e.target
    );
  }

  private _mousemove(e: MouseEvent): void {
    let resizerEl = e.target;
    if (this.moveIndex < 0) return;

    if (this.configs[this.moveIndex].resizerEl !== resizerEl) {
      this.moveIndex = -1;
      this.options.onDragEnd(e);
      return;
    }

    this.options.onDragStart(e);
    console.log('_mousemove', this.moveIndex);
  }

  private _mouseup(e: MouseEvent): void {
    this.moveIndex = -1;
    this.options.onDragEnd(e);
  }

  private _after(target: Element, dom: Element): void {
    if (target.nextSibling) {
      target.parentNode.insertBefore(dom, target.nextSibling);
    } else {
      target.parentNode.appendChild(dom);
    }
  }

  private _clampNumber(num: number, a: number, b: number): number {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }

  public destroy(): void {
    this.configs.forEach(config => {
      window.removeEventListener('mousedown', this._mousedown);
      window.removeEventListener('mousemove', this._mousemove);
      window.removeEventListener('mouseup', this._mouseup);
      config.parentEl.style.cssText = config.cacheStyle || '';
      if (!config.childrenConfig) return;
      config.childrenConfig.forEach(item => {
        let childrenEl = <HTMLElement>item.childrenEl;
        childrenEl.style.cssText = item.cacheStyle || '';
      });
    });
  }
}

(<any>window).Split = Split;
export default Split;

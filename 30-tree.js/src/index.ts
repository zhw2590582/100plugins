interface Options {
  el: string;
  nodes?: Tree[];
  onCheck?: (e: MouseEvent, tree: Tree) => void;
  onExpand?: (e: MouseEvent, tree: Tree) => void;
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
};


import './index.scss';
import {} from './utils';

class Tree {
  private options: Options;
  private configs: Configs;

  private constructor(options: Options) {
    this.options = {
      ...Tree.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS(): Options {
    return {
      el: '',
      nodes: [],
      onCheck: function() {},
      onExpand: function() {}
    };
  }

  private _init(): void {
    this._creatDom();
  }

  private _getConfigs(): void {
    // 
  }

  private _creatDom(): void {
    console.log(this)
  }

  private _eventBind(): void {
    //
  }

  public getTree(): void {
    //
  }

  public destroy(): void {
    //
  }
}

(<any>window).Tree = Tree;
export default Tree;

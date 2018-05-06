interface Options {

}

import './index.scss';
import {} from './utils';

class Tree {
  private options: Options;

  private constructor(options: Options = {}) {
    this.options = {
      ...Tree.DEFAULTS,
      ...options
    };

    this._init();
  }

  static get DEFAULTS() {
    return {

    };
  }

  private _init() {
    console.log(this)
  }

  public destroy() {

  }
}

(<any>window).Tree = Tree;
export default Tree;
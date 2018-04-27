interface Options {

}

import './index.scss';
import {} from './utils';

class Split {
  private options: Options;

  private constructor(options: Options = {}) {
    this.options = {
      ...Split.DEFAULTS,
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

(<any>window).Split = Split;
export default Split;
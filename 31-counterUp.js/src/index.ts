interface Options {

}

import './index.scss';
import {} from './utils';

class CounterUp {
  private options: Options;

  private constructor(options: Options = {}) {
    this.options = {
      ...CounterUp.DEFAULTS,
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

(<any>window).CounterUp = CounterUp;
export default CounterUp;
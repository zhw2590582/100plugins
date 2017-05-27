import listen from 'good-listener';

class Crop {
  constructor(options) {
    if (typeof options === 'undefined') {
      throw new TypeError('Crop required `options`.');
    } else if (typeof options.container === 'undefined') {
      throw new TypeError('Crop required `container` option.');
    } else if (typeof options.imgUrl === 'undefined') {
      throw new TypeError('Crop required `imgUrl` option.');
    } else if (typeof options.ratio < 1) {
      throw new TypeError('options.ratio must biger than or equal to 1');
    }

    this.options = Object.assign({}, Crop.DEFAULTS, options);

    if (options.container instanceof Element) {
      this.options.container = options.container;
    } else {
      this.options.container = document.querySelectorAll(options.container)[0];
    }

    this.config = {}

    this.listenList = {};

    this._cropModalEvent = this._cropModalEvent.bind(this);
    this._cropModalMove = this._cropModalMove.bind(this);
    this._cropModalMouseup = this._cropModalMouseup.bind(this);
  }

  static get DEFAULTS() {
    return {
      width: 500,
      height: 500,
      ratio: 1,
      tipText: {

      },
      tipFn: function(tip) {
        alert(tip);
      },
      callback: new Function()
    };
  }

  /**
  * ================================== Create Element ==================================
  */

  _createElement(){
    this.options.container.classList.add('crop_container');
    this.options.container.style.width = this.options.width + 'px';
    this.options.container.style.height = this.options.height + 'px';
    this.options.container.insertAdjacentHTML(
      'beforeend',
      '<div class="crop_wrap crop_wh">' +
        '<div class="crop_canvas crop_wh" style="background-image:url(' + this.options.imgUrl + ')"></div>' +
        '<div class="crop_modal crop_wh crop_crop"></div>' +
        '<div class="crop_box crop_wh"></div>' +
      '</div>'
    );
    this.cropCanvas = this.options.container.querySelectorAll('.crop_canvas')[0];
    this.cropModal = this.options.container.querySelectorAll('.crop_modal')[0];
    this.cropBox = this.options.container.querySelectorAll('.crop_box')[0];
    this.config.imgLeft = this.cropCanvas.getBoundingClientRect().left;
    this.config.imgTop = this.cropCanvas.getBoundingClientRect().top;
    this.config.imgWidth = this.cropCanvas.getBoundingClientRect().width;
    this.config.imgHeight = this.cropCanvas.getBoundingClientRect().height;
    this._cropBoxInit();
  }

  _cropBoxInit(){
    let imgRatio = this.config.imgWidth / this.config.imgHeight;
    this.cropBox.style.width = this.config.imgWidth * 0.5 / imgRatio + 'px';
    this.cropBox.style.height = this.config.imgHeight / this.options.ratio / imgRatio + 'px';
  }

  _createCropBox(){
    this.cropBox.insertAdjacentHTML(
      'beforeend',
      '<span class="crop_view">' +
        '<img src="' + this.options.imgUrl + '">' +
      '</span>' +
      '<span class="crop_dashed dashed_h"></span>' +
      '<span class="crop_dashed dashed_v"></span>' +
      '<span class="crop_center"></span>' +
      '<span class="crop_face crop_move"></span>' +
      '<span class="crop_line line_e"></span>' +
      '<span class="crop_line line_n"></span>' +
      '<span class="crop_line line_w"></span>' +
      '<span class="crop_line line_s"></span>' +
      '<span class="crop_point point_e"></span>' +
      '<span class="crop_point point_n"></span>' +
      '<span class="crop_point point_w"></span>' +
      '<span class="crop_point point_s"></span>' +
      '<span class="crop_point point_ne"></span>' +
      '<span class="crop_point point_nw"></span>' +
      '<span class="crop_point point_sw"></span>' +
      '<span class="crop_point point_se"></span>'
    );

    this.cropViewImg = this.options.container.querySelectorAll('.crop_view img')[0];
    this.cropViewImg.style.width = this.config.imgWidth + 'px';
    this.cropViewImg.style.height = this.config.imgHeight + 'px';
  }

  _destroyCropBox(){
    this.cropBox.innerHTML = '';
  }

  /**
  * ================================== Event Bind ==================================
  */

  _eventBind(){
    this.listenList._cropModalEvent = listen(this.cropModal, 'mousedown', this._cropModalEvent);
    this.listenList._cropBoxEvent = listen(this.cropModal, 'mousedown', this._cropBoxEvent);
  }

  _cropModalEvent(e){
    e.preventDefault();
    this.config.X = e.pageX - this.config.imgLeft;
    this.config.Y = e.pageY - this.config.imgTop;
    this.config.cache = { x: e.pageX, y: e.pageY };
    this.listenList._cropModalMove = listen(document.body, 'mousemove', this._cropModalMove);
    this.listenList._cropModalMouseup = listen(document.body, 'mouseup', this._cropModalMouseup);
  }

  _cropBoxEvent(e){
    e.preventDefault();

  }

  _cropModalMove(e){
    this.config.state = true;
    this.config.Width = e.pageX - this.config.cache.x;
    this.config.Height = e.pageY - this.config.cache.y;
    console.log(this.config.Width, this.config.Height);
  }

  _cropModalMouseup(e){
    this.config.state = false;
    this.listenList._cropModalMove.destroy();
    this.listenList._cropModalMouseup.destroy();
  }

  /**
  * ================================== PUBLIC METHODS ==================================
  */

  init(){
    this._createElement();
    this._createCropBox();
    this._eventBind();
  }

  destroy(){
    this.options.container.innerHTML = '';
  }

}

window.Crop = Crop;
module.exports = Crop;

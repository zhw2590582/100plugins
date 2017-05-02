class Zoom {
  constructor(options) {
    this.elements = [].slice.call(document.querySelectorAll('[data-zoom]')) || [];
    this.callback = !!options && options.callback || new Function();
    this._imgClick = this._imgClick.bind(this);
    this._modalClose = this._modalClose.bind(this);
    this._init();
  }

  _init() {
    this._eventBind();
  }

  _eventBind(){
    this.elements.forEach(item => {
      item.className += ' zoom_item';
      item.addEventListener('click', this._imgClick, false);
    })
  }

  _imgClick(e){
    this.imgTarget = e.target;
    if (document.getElementById('zoom_modal') === null) {
      this._createElement();
    } else {
      this.imgTarget.style.visibility = 'hidden';
      this.zoomModal.style.display = 'flex';
      this._insertElement();
    }

  }

  _createElement(){
    this.zoomModal = document.createElement('div');
    this.zoomModal.setAttribute('id', 'zoom_modal');
    this.zoomModal.addEventListener('click', this._modalClose, false);
    this.zoomImg = document.createElement('img');
    this.zoomImg.src = this.imgTarget.getAttribute('data-zoom');
    this.zoomImg.setAttribute('id', 'zoom_img');
    this.zoomModal.appendChild(this.zoomImg);
    document.body.appendChild(this.zoomModal);
  }

  _insertElement(){
    this.zoomImg.src =this.imgTarget.getAttribute('data-zoom');
  }

  _modalClose(){
    this.zoomModal.style.display = 'none';
    this.imgTarget.style.visibility = 'visible';
  }

  _getStyle(el, attr) {
    if (el && el.currentStyle) {
      return el.currentStyle[attr]
    } else {
      return window.getComputedStyle(el)[attr]
    }
  }

}

window.Zoom = Zoom;
module.exports = Zoom;

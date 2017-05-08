class Uploader {
  constructor(options) {
    if (typeof options === 'undefined') {
      throw new TypeError('Uploader required `options`.');
    } else if (typeof options.target === 'undefined') {
      throw new TypeError('Uploader required `target` option.');
    }

    this.options = Object.assign({}, Uploader.DEFAULTS, options);

    if (options.target instanceof Element) {
      this.options.target = options.target;
    } else {
      this.options.target = document.querySelectorAll(options.target)[0];
    }

    if (options.fileList instanceof Element) {
      this.options.fileList = options.fileList;
    } else {
      this.options.fileList = document.querySelectorAll(options.fileList)[0];
    }

    this._init();
  }

  static get DEFAULTS() {
    return {
      paramName: 'file',
      maxFiles: 10,
      maxFilesize: 512,
      acceptedFiles: '.jpg, .jpge, .png, .gif',
      addRemoveLinks: false,
      uploadMultiple: true,
      autoUpload: true,
      addedfile: new Function(),
      removedfile: new Function(),
      success: new Function(),
      complete: new Function(),
      canceled: new Function(),
      uploadprogress: new Function(),
      init: new Function(),
      message: {
        uploadText: '将文件拖到此处，或点击上传',
        maxFilesText: '到达最多上传数目',
        maxFilesizeText: '文件过大',
        singleFileText: '只能上传单个文件',
        acceptedFilesText: '不支持该文件格式'
      },
      messageFn: function(tip) {alert(tip);}
    };
  }

  _init() {
    this._createUploader();
    this._createFileList();
    this._eventBind();
  }

  /**
  * ================================== Create Element ==================================
  */

  _createUploader() {
    this.options.target.insertAdjacentHTML(
      'beforeend',
      '<div class="uploader_container"><div class="upload_dragger"><span class="upload_icon"></span><span class="upload_text">' +
        this.options.message.uploadText +
      '</span><div></div>'
    );
    this.uploaderContainer = this.options.target.querySelectorAll('.uploader_container')[0];
  }

  _createFileList(fileList) {
    this.options.fileList.insertAdjacentHTML(
      'beforeend',
      '<div class="fileList_container"></div>'
    );
    this.fileListContainer = this.options.fileList.querySelectorAll('.fileList_container')[0];
  }

  /**
  * ================================== Event Bind ==================================
  */

  _eventBind() {
    let self = this;
    this.uploaderContainer.addEventListener('dragenter', function(e) {
      e.preventDefault();
    }, false );
    this.uploaderContainer.addEventListener('dragleave', function(e) {
      e.preventDefault();
      self.uploaderContainer.classList.remove('dragenter');
    }, false);
    this.uploaderContainer.addEventListener( 'dragover', function(e) {
      e.preventDefault();
      self.uploaderContainer.classList.add('dragenter');
    }, false);
    this.uploaderContainer.addEventListener('drop', function(e) {
      self._eventDrop(e);
    }, false);
  }

  _eventDrop(e) {
    e.preventDefault();
    this.uploaderContainer.classList.remove('dragenter');
    let fileList = [].slice.call(e.dataTransfer.files);
    let flag = true;
    if (fileList.length == 0) {return false};
    if (this.options.uploadMultiple === false && fileList.length > 1) {
      this.options.messageFn(this.options.message.singleFileText);
      flag = false;
      return false;
    }
    if (fileList.length > this.options.maxFiles) {
      this.options.messageFn(this.options.message.maxFilesText);
      flag = false;
      return false;
    }
    fileList.every(file => {
      if (file.size > this.options.maxFilesize*1024) {
        this.options.messageFn(this.options.message.maxFilesizeText);
        flag = false;
        return false;
      }
      if (file.type.indexOf('image') === -1 || this.options.acceptedFiles.indexOf(file.type.split('/')[1]) === -1) {
        this.options.messageFn(this.options.message.acceptedFilesText);
        flag = false;
        return false;
      }
      return true
    })
    if (flag) {
      this.fileList = fileList;
      this.options.addedfile(this.fileList);
      this._createPreview();
      this.options.autoUpload && this._uploadOpen();
    }
  }

  _createPreview(){
    let self = this;
    this.fileList.forEach((file, index) => {
      let ObjectURL;
      if (window.URL.createObjectURL) {
      　ObjectURL = window.URL.createObjectURL(file);
      } else if (window.webkitURL.createObjectURL) {
      　ObjectURL = window.webkitURL.createObjectURL(file);
      }
      self.fileListContainer.insertAdjacentHTML(
        'beforeend',
        '<div class="fileItem">' +
          '<img class="imgPreview" src="' + ObjectURL +'">' +
          '<div class="imgInfo">' +
            '<p class="infoName">' + file.name +'</p>' +
          '</div>' +
          '<span class="imgDel">×</span>' +
          '<span class="imgUploaded">√</span>' +
        '</div>'
      );
    });
    [].slice.call(this.fileListContainer.querySelectorAll('.imgDel')).forEach((item, index) => {
      item.addEventListener('click', function () {

      }, false);
    })
  }

  _uploadOpen(){
    console.log('_uploadOpen');
  }

}

window.Uploader = Uploader;
export default window.Uploader;

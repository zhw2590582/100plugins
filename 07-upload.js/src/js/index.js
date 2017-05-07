class Uploader {
  constructor(options) {

    this._init();
  }

  _init() {
    this._XHR()
  }

  _XHR(){
    let xhr = new XMLHttpRequest();
    xhr.withCredentials=true;
    xhr.open("POST", "http://jsonplaceholder.typicode.com/posts");
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xhr.send("title=foo&body=bar&userId=1");
    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            console.log(0);
        }
    }
    xhr.onload = function(){
        if(this.status === 201){
          console.log(this);
        }
    }
  }

}

window.Uploader = Uploader
export default window.Uploader

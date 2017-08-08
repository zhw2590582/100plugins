## Pullrefresh.js

一个很简单的Javascript原生面向对象的打字效果插件

## 使用
```js

import Typing from './js/typing.js';

//接收两个参数
//第一个参数为字符串或者DOM，假如使用光标，则建议为浮动元素（例如span），默认为'.typing'，为必填
//第二个参数为对象，为选填

var typingDemo = new Typing('.typingDemo1', {
  strings: ['帝高阳之苗裔兮，朕皇考曰伯庸。', '摄提贞于孟陬兮，惟庚寅吾以降。'], //需要被显示的字符串数组
  typeSpeed: 100, //打字速度
  backSpeed: 50, //删除速度
  startDelay: 500, //开始延迟
  backDelay: 1000, //删除延迟
  loop: true, //是否循环
  showCursor: true, //是否显示
  cursorChar: '|', //光标字符串
  onFinished: function(a, b) { //当loop为false且打字结束时回调，a参数为strings的长度，b为最后一个的字符串长度
    console.log('结束了', a, b);
  }
});

//销毁实例
typingDemo.destory();

```
## 开发

安装依赖
```sh
$ npm install
```

开发模式：http://localhost:8080/
```sh
$ npm run dev
```

发布模式
```sh
$ npm run build
```

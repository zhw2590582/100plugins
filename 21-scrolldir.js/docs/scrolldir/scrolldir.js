!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var o in r)("object"==typeof exports?exports:e)[o]=r[o]}}("undefined"!=typeof self?self:this,function(){return function(e){function t(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){"use strict";var o=window,n=document.documentElement,i=(document.body,{off:!1,attribute:"data-scrolldir",el:"",direction:"down"}),u=function(e){console.log(e)},f=function(e){if(Object.assign(i,e),i.el&&"string"==typeof i.el&&!(n=document.querySelector(i.el)))throw TypeError("el is not an element");if(!0===i.off)return n.setAttribute(i.attribute,"off"),o.removeEventListener("scroll",u);if(i.attribute&&"string"==typeof i.attribute){var t=["dowm","up"].includes(i.direction)?i.direction:"down";n.setAttribute(i.attribute,t)}return o.addEventListener("scroll",u)};window.scrolldir=f,e.exports=f}])});
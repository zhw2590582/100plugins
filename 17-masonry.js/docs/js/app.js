// 懒人版插入dom
var container = document.querySelector('.masonry-container');
var i = 0;
var list = [];
while(++i <= 100){
    list.push('<div class="masonry-item"><img src="./img/' + Math.floor(Math.random() * 30 + 1) + '.jpg" alt="" class="masonry-image"></div>')
}
container.insertAdjacentHTML('beforeend', list.join(''));
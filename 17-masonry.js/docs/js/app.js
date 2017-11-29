// 懒人版插入dom
var container = document.querySelector('.masonry-container');
var i = 0;
var list = [];
while(++i <= 30){
    list.push('<div class="masonry-item"><img src="./img/' + i + '.jpg" alt="" class="masonry-image"></div>')
}
container.insertAdjacentHTML('beforeend', list.join(''));
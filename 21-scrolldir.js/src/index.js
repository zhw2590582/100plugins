import './index.scss';

let scrolldir = options => {
  Promise.resolve().then(() => {
    console.log('hi');
  })
};

window.scrolldir = scrolldir;
module.exports = scrolldir;

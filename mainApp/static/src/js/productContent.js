//# define constants #//
const carousel = document.getElementById('carousel-wrapper');
const slider = carousel.querySelector('#slider');
const carousel_item = carousel.querySelector('.item');
const left_arrow = carousel.querySelector('.arrow.left');
const right_arrow = carousel.querySelector('.arrow.right');
//# define constants #//


//! FUNCTIONS !// @event handlers
right_arrow.addEventListener('click', ()=> slider.scrollLeft += carousel_item.offsetWidth);   
left_arrow.addEventListener('click', ()=> slider.scrollLeft -= carousel_item.offsetWidth);
//! FUNCTIONS !//
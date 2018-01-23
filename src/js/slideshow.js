import Swiper from 'swiper';

const elems = document.querySelectorAll('.js-slideshow');

if (elems) {
  [].forEach.call(elems, elem => {
    const slideshow = new Swiper(elem, {
      pagination: {
        el: elem.querySelector('.js-slideshow-pagination'),
        type: 'fraction'
      },
      navigation: {
        nextEl: elem.querySelector('.js-slideshow-next'),
        prevEl: elem.querySelector('.js-slideshow-prev'),
        disabledClass: 'is-disabled'
      },
      a11y: true,
      autoHeight: true,
      preloadImages: false,
      lazy: {
        loadPrevNext: true
      },
    });
  });
}

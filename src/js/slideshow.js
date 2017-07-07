import Swiper from 'swiper';

const elems = document.querySelectorAll('.js-slideshow');

if (elems) {
  [].forEach.call(elems, elem => {
    const slideshow = new Swiper(elem, {
      pagination: elem.querySelector('.js-slideshow-pagination'),
      nextButton: elem.querySelector('.js-slideshow-next'),
      prevButton: elem.querySelector('.js-slideshow-prev'),
      buttonDisabledClass: 'is-disabled',
      paginationType: 'fraction',
      a11y: true,
      lazyLoading: true,
      preloadImages: false,
      lazyLoadingInPrevNext: true
    });
  });
}

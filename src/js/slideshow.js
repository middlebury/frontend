import Swiper from 'swiper';

const elems = document.querySelectorAll('.js-slideshow');

if (elems) {
  [].forEach.call(elems, elem => {
    const slideshowCaption = elem.querySelector('.js-slideshow-caption');

    const nextEl = elem.querySelector('.js-slideshow-next');
    const prevEl = elem.querySelector('.js-slideshow-prev');

    const slideshow = new Swiper(elem, {
      pagination: {
        el: elem.querySelector('.js-slideshow-pagination'),
        type: 'fraction'
      },
      navigation: {
        nextEl,
        prevEl,
        disabledClass: 'is-disabled'
      },
      a11y: true,
      autoHeight: true,
      init: false
    });

    const captions = elem.querySelectorAll('figcaption');

    [].forEach.call(captions, c => (c.style.display = 'none'));

    slideshowCaption.innerText = captions[0].innerText;

    slideshow.on('slideChangeTransitionEnd', function () {
      const activeSlide = elem.querySelector('.swiper-slide-active');
      const caption = activeSlide.querySelector('figcaption');
      slideshowCaption.innerText = caption.innerText;
    });

    slideshow.on('slideChangeTransitionStart', function () {
      slideshowCaption.innerText = '';
    });

    slideshow.init();

    nextEl.removeAttribute('role');
    prevEl.removeAttribute('role');
  });
}

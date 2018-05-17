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

    slideshowCaption.innerHTML = captions[0].textContent;

    slideshow.on('slideChangeTransitionEnd', function () {
      const activeSlide = elem.querySelector('.swiper-slide-active');
      const caption = activeSlide.querySelector('figcaption');
      slideshowCaption.innerHTML = caption.textContent;
    });

    slideshow.init();

    nextEl.removeAttribute('role');
    prevEl.removeAttribute('role');
  });
}

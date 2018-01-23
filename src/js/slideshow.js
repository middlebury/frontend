import Swiper from 'swiper';

const elems = document.querySelectorAll('.js-slideshow');

if (elems) {
  [].forEach.call(elems, elem => {
    const slideshowCaption = elem.querySelector('.js-slideshow-caption');

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
      init: false
    });

    var captions = elem.querySelectorAll('figcaption');

    [].forEach.call(captions, c => (c.style.display = 'none'));

    slideshowCaption.innerText = captions[0].innerText;

    slideshow.on('slideChangeTransitionEnd', function () {
      var activeSlide = elem.querySelector('.swiper-slide-active');
      var caption = activeSlide.querySelector('figcaption');
      slideshowCaption.innerText = caption.innerText;
    });

    slideshow.on('slideChangeTransitionStart', function () {
      slideshowCaption.innerText = '';
    });

    slideshow.init();
  });
}

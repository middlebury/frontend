import Swiper from 'swiper';

const elems = document.querySelectorAll('.js-slideshow');

function setSlideshowCaption(targetElem, captionElem) {
  if (captionElem && captionElem.textContent) {
    targetElem.innerHTML = captionElem.textContent.trim();
  }
}

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

    setSlideshowCaption(slideshowCaption, captions[0]);

    slideshow.on('slideChangeTransitionEnd', function () {
      const activeSlide = elem.querySelector('.swiper-slide-active');
      const caption = activeSlide.querySelector('figcaption');
      setSlideshowCaption(slideshowCaption, caption);
    });

    slideshow.init();

    nextEl.removeAttribute('role');
    prevEl.removeAttribute('role');
  });
}

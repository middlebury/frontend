import './toggler';
import './nav';
import './mission-selector';
// import './carousel';

import Swiper from 'swiper';

const pubSwiperElem = document.querySelector('.js-publications-swiper');

if (pubSwiperElem) {
  const publicationsSwiper = new Swiper(pubSwiperElem, {
    a11y: true,
    buttonDisabledClass: 'publications__button--disabled',
    slidesPerView: 4,
    nextButton: '.js-publications-next-button',
    prevButton: '.js-publications-prev-button',
    breakpoints: {
      580: {
        slidesPerView: 1
      },
      960: {
        slidesPerView: 2
      }
    }
  });
}


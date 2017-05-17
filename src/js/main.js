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

const programSwiperElem = document.querySelector('.js-program-spotlight');

if (programSwiperElem) {
  const programSwiper = new Swiper(programSwiperElem, {
    buttonDisabledClass: 'button--disabled',
    slidesPerView: 3,
    nextButton: '.js-program-spotlight-next-button',
    prevButton: '.js-program-spotlight-prev-button',
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

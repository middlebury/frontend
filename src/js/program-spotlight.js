import enquire from 'enquire.js';
import Swiper from 'swiper';

import config from './config';

const mq = `screen and (min-width: ${config.breakpoints.sm}px)`;

let swiperInstance;

const swiperConfig = {
  buttonDisabledClass: 'button--disabled',
  slidesPerView: 3,
  nextButton: '.js-program-spotlight-next-button',
  prevButton: '.js-program-spotlight-prev-button',
  breakpoints: {
    [config.breakpoints.sm]: {
      slidesPerView: 1
    },
    [config.breakpoints.md]: {
      slidesPerView: 2
    }
  }
};

function match() {
  const programSwiperElem = document.querySelector('.js-program-spotlight');
  swiperInstance = new Swiper(programSwiperElem, swiperConfig);
}

function unmatch() {
  if (swiperInstance instanceof Swiper) {
    swiperInstance.destroy(
      true, // deleteInstancee
      true // cleanupStyles
    );
  }
}

enquire.register(mq, {
  match,
  unmatch
});

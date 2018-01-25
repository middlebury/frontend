import enquire from 'enquire.js';
import Swiper from 'swiper';

import config from './config';

const mq = `screen and (min-width: ${config.breakpoints.sm}px)`;

let swiperInstance;

const swiperWrapper = document.querySelector('.swiper-wrapper');

const swiperConfig = {
  buttonDisabledClass: 'button--disabled',
  slidesPerView: 3,
  grabCursor: true,
  nextButton: '.js-program-spotlight-next-button',
  prevButton: '.js-program-spotlight-prev-button',
  breakpoints: {
    [config.breakpoints.md]: {
      slidesPerView: 1
    },
    [config.breakpoints.lg]: {
      slidesPerView: 2
    }
  }
};

function match() {
  for (let i = swiperWrapper.children.length; i >= 0; i--) {
    swiperWrapper.appendChild(swiperWrapper.children[(Math.random() * i) | 0]);
  }

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

if (swiperWrapper) {
  enquire.register(mq, {
    match,
    unmatch
  });
}

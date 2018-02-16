import Swiper from 'swiper';

import config from './config';

function randomizeChildren(elem) {
  for (let i = elem.children.length; i >= 0; i--) {
    elem.appendChild(elem.children[(Math.random() * i) | 0]);
  }
}

function createProgramSwiper() {
  const swiperWrapper = document.querySelector('.js-swiper-wrapper');
  
  if(!swiperWrapper) {
    // do nothing if no swiper wrapper
    return;
  }

  randomizeChildren(swiperWrapper);

  const swiperConfig = {
    slidesPerView: 3,
    grabCursor: true,
    navigation: {
      nextEl: '.js-program-spotlight-next-button',
      prevEl: '.js-program-spotlight-prev-button',
      disabledClass: 'button--disabled'
    },
    breakpoints: {
      [config.breakpoints.md]: {
        slidesPerView: 1
      },
      [config.breakpoints.lg]: {
        slidesPerView: 2
      }
    }
  };

  const programSwiperElem = document.querySelector('.js-program-spotlight');

  new Swiper(programSwiperElem, swiperConfig);
}

createProgramSwiper();

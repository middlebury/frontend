import Swiper from 'swiper';

import config from './config';

function randomizeChildren(elem) {
  for (let i = elem.children.length; i >= 0; i--) {
    elem.appendChild(elem.children[(Math.random() * i) | 0]);
  }
}

function createProgramSwiper() {
  const swiperWrappers = Array.prototype.slice.apply(
    document.querySelectorAll('.js-swiper-wrapper')
  );

  if (!swiperWrappers) {
    // do nothing if no swiper wrapper
    return;
  }

  swiperWrappers.forEach((swiperWrapper) => {
    randomizeChildren(swiperWrapper);

    const swiperId = '#' + swiperWrapper.id;

    const swiperConfig = {
      slidesPerView: 3,
      grabCursor: true,
      navigation: {
        nextEl: swiperId + '-next',
        prevEl: swiperId + '-prev',
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

    const programSwiperElem = document.querySelector(swiperId + "-container");

    new Swiper(programSwiperElem, swiperConfig);
  });
}

createProgramSwiper();

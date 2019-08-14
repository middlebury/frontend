import { CountUp } from 'countup.js';

import { onElementInView } from './utils/on-element-in-view';

function makeCountUp(el) {
  const target = el.innerText;
  const num = parseInt(target, 10);
  const countUp = new CountUp(el, num);

  if (!countUp.error) {
    setTimeout(() => {
      countUp.start();
    }, 400);
  } else {
    console.error(countUp.error);
  }
}

function makeLazyCountUp(el) {
  onElementInView(el, () => {
    makeCountUp(el);
  });
}

const els = document.querySelectorAll('[data-countup]');

[].forEach.call(els, makeLazyCountUp);

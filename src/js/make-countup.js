import { CountUp } from 'countup.js';

function makeCountUp(el) {
  const target = el.innerText;
  const num = parseInt(target, 10);
  const countUp = new CountUp(el, num);
  console.log(el);

  countUp.start();

  if (!countUp.error) {
    countUp.start();
  } else {
    console.error(countUp.error);
  }
}

const els = document.querySelectorAll('[data-countup]');

[].forEach.call(els, makeCountUp);

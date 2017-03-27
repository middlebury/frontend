import enquire from 'enquire.js';
import forEach from './utils/forEach';
import optimizedResize from './utils/optimizedResize';

const selector = {
  CAROUSEL: '[data-carousel]',
  NEXT_BUTTON: '[data-carousel-next]',
  PREV_BUTTON: '[data-carousel-prev]',
  CONTAINER: '[data-carousel-container]',
  ITEM: '[data-carousel-item]'
};

const defaultConfig = {
  show: 1,
  loop: false,
  minWidth: 0
};

class Carousel {
  constructor(elem, config = defaultConfig) {
    this.elem = elem;

    this.config = this.getConfig(config);

    this.items = elem.querySelectorAll(selector.ITEM);
    this.container = this.elem.querySelector(selector.CONTAINER);

    this.nextBtn = this.elem.querySelector(selector.NEXT_BUTTON);
    this.prevBtn = this.elem.querySelector(selector.PREV_BUTTON);

    this.show = 1;
    this.index = 1;
    this.itemCount = 0;
    this.itemWidth = 0;

    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.enabled = false;

    if (this.config.minWidth && this.config.minWidth > 0) {
      enquire.register(`screen and (min-width: ${this.config.minWidth}px)`, {
        match: () => {
          this.enable();
        },
        unmatch: () => {
          this.disable();
        }
      });
    }
  }

  enable() {
    if (!this.items || this.enabled) {
      return;
    }

    this.enabled = true;

    this.addListeners();

    this.reset();
  }

  disable() {
    if (!this.enabled) {
      return;
    }

    // remove event handlers from next and previous controls
    if (this.nextBtn && this.prevBtn) {
      this.nextBtn.removeEventListener('click', this.handleNextClick);
      this.prevBtn.removeEventListener('click', this.handlePrevClick);
    }

    // remove window resize checker
    window.removeEventListener('optimizedResize', this.handleWindowResize);

    // remove minWidth inline style from carousel items
    forEach(this.items, item => {
      item.style.minWidth = '';
    });

    // set the widget to disabled
    this.enabled = false;
  }

  reset() {
    this.index = 1;
    this.show = this.getShow();
    this.itemCount = this.items.length;
    this.itemWidth = this.getItemWidth();
    this.positionContainer(this.index);
    this.updateControls();
  }

  addListeners() {
    if (this.nextBtn && this.prevBtn) {
      this.nextBtn.addEventListener('click', this.handleNextClick);
      this.prevBtn.addEventListener('click', this.handlePrevClick);
    }

    window.addEventListener('optimizedResize', this.handleWindowResize);
  }

  getConfig(defaultConfig) {
    let config = {};

    const configAttr = this.elem.getAttribute('data-carousel');

    if (configAttr) {
      try {
        config = JSON.parse(configAttr);
      }
      catch (e) {
        console.error(e);
      }
    }

    return Object.assign({}, defaultConfig, config);
  }

  isLastItemVisible() {
    return this.index + (this.show - 1) >= this.itemCount;
  }

  getShow() {
    let show = 1;

    if (typeof this.config.show === 'object') {
      for (let key in this.config.show) {
        if (window.matchMedia(`(min-width: ${key}px)`).matches) {
          show = this.config.show[key];
        }
      }
    }
    else {
      show = this.config.show;
    }

    return this.itemCount > this.show ? this.itemCount : show;
  }

  updateControls() {
    this.prevBtn.removeAttribute('disabled');
    this.nextBtn.removeAttribute('disabled');

    if (this.index === this.itemCount || this.isLastItemVisible()) {
      this.nextBtn.setAttribute('disabled', true);
    }
    else if (this.index === 1) {
      this.prevBtn.setAttribute('disabled', true);
    }
  }

  getItemWidth() {
    const item = this.items[0];
    return item.getBoundingClientRect().width || item.offsetWidth;
  }

  handleWindowResize() {
    this.reset();
  }

  next() {
    this.positionContainer(this.index + 1);
  }

  prev() {
    this.positionContainer(this.index - 1);
  }

  positionContainer(index) {
    const width = (index - 1) * this.itemWidth;
    this.index = index;
    this.container.style.transform = `translateX(-${width}px)`;
    this.updateControls();
  }

  setAriaAttributes() {
    forEach(this.items, (item, i) => {
      if (i === this.index) {
        item.setAttribute('aria-hidden', true);
      }
    });
  }

  handlePrevClick(e) {
    e.preventDefault();
    this.prev();
  }

  handleNextClick(e) {
    e.preventDefault();
    this.next();
  }
}

const carousels = document.querySelectorAll('[data-carousel]');

Array.from(carousels).forEach(elem => new Carousel(elem));

export default Carousel;

import forEach from './utils/forEach';

const selector = {
  CAROUSEL: '[data-carousel]',
  NEXT_BUTTON: '[data-carousel-next]',
  PREV_BUTTON: '[data-carousel-prev]',
  CONTAINER: '[data-carousel-container]',
  ITEM: '[data-carousel-item]'
};

class Carousel {
  constructor(
    elem,
    config = {
      show: 1,
      loop: false
    }
  ) {
    this.elem = elem;

    this.config = this.getConfig(config);

    this.items = elem.querySelectorAll(selector.ITEM);
    this.container = this.elem.querySelector(selector.CONTAINER);

    this.nextBtn = this.elem.querySelector(selector.NEXT_BUTTON);
    this.prevBtn = this.elem.querySelector(selector.PREV_BUTTON);

    this.show = this.getShow();

    this.index = 1;
    this.itemCount = 0;
    this.itemWidth = 0;
    this.offset = 0;

    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);

    this.init();
  }

  getConfig(defaultConfig) {
    const configAttr = this.elem.getAttribute('data-carousel');

    let config = {};

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

  getShow() {
    let show = 1;

    if (typeof this.config.show == 'object') {
      Object.keys(this.config.show, key => {
        if (window.matchMedia(`(min-width: ${key})`).matches) {
          show = this.config.show[key];
        }
      });
    }
    else {
      show = this.config.show;
    }

    return this.totalItems > show ? this.totalItems : show;
  }

  isLastItemVisible() {
    let x = this.index + (this.show - 1) >= this.itemCount;
    console.log(x);
    return x;
  }

  init() {
    if (!this.items) {
      return;
    }

    this.addListeners();

    this.itemCount = this.items.length;

    this.setItemWidth();

    this.updateControls();
  }

  addListeners() {
    if (this.nextBtn && this.prevBtn) {
      this.nextBtn.addEventListener('click', this.handleNextClick);
      this.prevBtn.addEventListener('click', this.handlePrevClick);
    }
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

  setItemWidth() {
    this.itemWidth = this.items[0].offsetWidth;
  }

  watchResize() {}

  next() {
    this.positionContainer(this.index + 1);
  }

  prev() {
    this.positionContainer(this.index - 1);
  }

  positionContainer(index) {
    console.log(index);
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

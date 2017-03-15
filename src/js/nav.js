class Navigation {
  constructor(elem) {
    this.elem = elem;
    this.backButton = this.elem.querySelector('[data-nav-back]');
    // TODO: need to only get first level of items for this list and not any sub navs
    this.items = this.elem.querySelectorAll('[data-nav-list] > li > [data-nav-link]');

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);

    this.isOpen = false;

    this.navActiveClass = 'is-open';
    this.subnavActiveClass = 'is-active';

    this.init();
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.items.forEach(item => item.addEventListener('click', this.handleItemClick));
    this.backButton.addEventListener('click', this.handleBackClick);
  }

  open(subnav) {
    this.isOpen = true;
    this.elem.classList.add(this.navActiveClass);

    subnav.classList.add(this.subnavActiveClass);
  }

  close() {
    this.elem.classList.remove(this.navActiveClass);
    this.elem.classList.remove(this.subnavActiveClass);
    this.isOpen = false;
  }

  handleBackClick(e) {
    e.preventDefault();
    this.close();
  }

  handleItemClick(e) {
    const subnav = e.target.nextElementSibling;

    if (subnav && subnav.hasAttribute('data-nav')) {
      e.preventDefault();
      this.open(subnav);
    }
  }
}

const navs = document.querySelectorAll('[data-nav]');

// TODO: use forEach helper as Array.from is lacking browser support
Array.from(navs).forEach(elem => new Navigation(elem));

module.exports = Navigation;
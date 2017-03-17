class Toggler {
  constructor(elem) {
    const target = elem.getAttribute('data-toggle-target');

    this.isToggled = false;
    this.activeClass = 'is-toggled';
    this.enabledClass = 'has-toggler';
    this.target = document.querySelector(target);
    this.elem = elem;

    this.handleElemClick = this.handleElemClick.bind(this);

    this.init();
  }

  init() {
    this.addListeners();
    this.elem.classList.add(this.enabledClass);
    this.target.classList.add(this.enabledClass);
  }

  destroy() {
    this.elem.classList.remove(this.enabledClass);
    this.elem.classList.remove(this.activeClass);
    this.target.classList.remove(this.enabledClass);
    this.target.classList.remove(this.activeClass);
    this.elem.removeEventListener('click', this.handleElemClick);
  }

  addListeners() {
    this.elem.addEventListener('click', this.handleElemClick);
  }

  handleElemClick(e) {
    e.preventDefault();
    this.toggle();
  }

  toggle() {
    if (this.toggled) {
      this.toggled = false;
      this.target.classList.remove(this.activeClass);
      this.elem.classList.remove(this.activeClass);
      return;
    }

    this.toggled = true;
    this.target.classList.add(this.activeClass);
    this.elem.classList.add(this.activeClass);
  }
}

const togglers = document.querySelectorAll('[data-toggle-target]');

// TODO: use forEach helper as Array.from is lacking browser support
Array.from(togglers).forEach(elem => new Toggler(elem));

export default Toggler;

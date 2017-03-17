const ESC_KEY = 27;

class Modal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
    this.closeButton = this.modal.querySelector('[data-dismiss="modal"]');
    this.isOpen = false;

    this.activeBodyClass = 'has-modal';
    this.activeModalClass = 'is-open';

    this.handleEscKeyPress = this.handleEscKeyPress.bind(this);
    this.handleCloseButtonClick = this.handleCloseButtonClick.bind(this);

    this.init();
  }

  init() {
    this.addListeners();
  }

  addListeners() {
    this.closeButton.addEventListener('click', this.handleCloseButtonClick);
  }

  setEscapeEvent() {
    if (this.isOpen) {
      this.modal.addEventListener('keyup', this.handleEscKeyPress);
    }
    else if (!this.isOpen) {
      this.modal.removeEventListener('keyup', this.handleEscKeyPress);
    }
  }

  handleEscKeyPress(e) {
    if (e.keyCode === ESC_KEY) {
      e.preventDefault();
      this.close();
    }
  }

  handleCloseButtonClick(e) {
    e.preventDefault();
    this.close();
  }

  open() {
    this.isOpen = true;
    this.modal.classList.add(this.activeModalClass);
    this.modal.focus();

    this.modal.removeAttribute('aria-hidden');

    this.setEscapeEvent();

    document.body.classList.add(this.activeBodyClass);
  }

  close() {
    this.isOpen = false;
    this.setEscapeEvent();

    this.modal.setAttribute('aria-hidden', true);

    document.body.classList.remove(this.activeBodyClass);
    this.modal.classList.remove(this.activeModalClass);
  }
}

export default Modal;

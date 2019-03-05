const SELECTOR =
  'input:not([type^=hidden]):not([type^=submit]), select, textarea';

class FormValidator {
  constructor(el) {
    this.elem = el;

    this.errorClass = 'form__group--has-error';
    this.groupClass = 'form__group';
    this.errorTextClass = 'form__error-text';

    this.items = el.querySelectorAll(SELECTOR);

    this.init();
  }

  init() {
    this.elem.setAttribute('novalidate', 'true');
    this.addListeners();
  }

  handleFieldBlur = e => {
    console.log(e);
    this.validateField(e.target);
  };

  addListeners() {
    this.items.forEach(el => {
      el.addEventListener('blur', this.handleFieldBlur);
    });

    this.elem.addEventListener('submit', this.handleSubmit);
  }

  validateFields() {
    console.log('validate');

    let valid = false;

    this.items.forEach(el => {
      valid = this.validateField(el);
    });

    return valid;
  }

  handleSubmit = e => {
    const valid = this.validateFields();

    if (!valid) {
      e.preventDefault();
    }
  };

  addError(el) {
    const group = el.closest('.' + this.groupClass);

    let errorEl = null;

    if (group) {
      group.classList.add(this.errorClass);

      errorEl = group.querySelector('.' + this.errorTextClass);

      if (!errorEl) {
        const err = 'This field is required';
        errorEl = document.createElement('p');
        errorEl.classList.add(this.errorTextClass);
        errorEl.innerHTML = err;
        errorEl.setAttribute('role', 'alert');
        errorEl.id = errorDescId;
        el.parentNode.insertBefore(errorEl, el.nextSibling);

        const errorDescId = 'midd-form-validation-error-' + el.name;
        const originalDescBy = el.getAttribute('aria-describedby');
        const descBy = [originalDescBy, errorDescId].join(' ');
        el.setAttribute('aria-describedby', descBy);
      }
    }
  }

  validateField(el) {
    const { value } = el;

    const required = el.hasAttribute('required');

    if (!required) {
      console.log('field not required');
      return true;
    }

    if (value && value.trim()) {
      console.log('field is required but has value');
      return true;
    }

    // TODO: add described by to point to error text
    el.setAttribute('aria-invalid', true);

    this.addError(el);

    return false;
  }
}

const forms = document.querySelectorAll('[data-validate-form]');
forms.forEach(el => new FormValidator(el));

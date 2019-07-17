import { $, $$, on, off } from './utils/dom';

/**
 * Creates a basic dropdown widget that has a button to toggle an active class on an element.
 *
 * Handles aria-expanded and focusing the first link in the data-dropdown-menu.
 *
 * Different from toggler.js since we watch for clicks outside the element to close the dropdown
 * Could probably be merged with toggler somehow.
 *
 * Example:
 *
 * <div data-dropdown>
 *   <button data-dropdown-button>open dropdown</button>
 *   <ul data-dropdown-menu>
 *     ...
 *   </ul>
 * </div>
 */

let dropdowns = 1;

class Dropdown {
  constructor(elem) {
    this.elem = elem;

    this.id = dropdowns++;

    this.btn = $('[data-dropdown-button]', elem);
    this.menu = $('[data-dropdown-menu]', elem);
    this.items = $$('[data-dropdown-item]', this.menu);

    this.firstItem = this.items[0];
    this.lastItem = this.items[this.items.length - 1];

    this.activeClass = 'is-active';
    this.isOpen = false;
    this.index = 0;

    this.keyCode = {
      TAB: 9,
      RETURN: 13,
      ESC: 27,
      SPACE: 32,
      PAGEUP: 33,
      PAGEDOWN: 34,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    };

    this.init();
  }

  init() {
    this.btn.setAttribute('aria-expanded', false);
    this.btn.setAttribute('aria-haspopup', true);

    this.menu.setAttribute('role', 'menu');
    [].forEach.call(this.items, item => item.setAttribute('role', 'menuitem'));
    const id = `midd-dropdown-${this.id}-btn`;
    this.btn.setAttribute('id', id);
    this.menu.setAttribute('aria-labelledby', id);

    // remove role from list items so they are not announced
    const listitems = $$('li', this.menu);
    [].forEach.call(listitems, item => item.setAttribute('role', 'none'));
    this.addListeners();
  }

  addListeners() {
    on(this.btn, 'click', this.handleBtnClick);
    on(this.btn, 'keydown', this.handleBtnKeyDown);

    [].forEach.call(this.items, item => {
      item.setAttribute('tabindex', '-1');
    });
  }

  destroy() {
    off(this.btn, 'click', this.handleBtnClick);
    off(this.btn, 'keydown', this.handleBtnKeyDown);

    this.hideMenu();
  }

  handleBtnClick = e => {
    this.toggle();
  };

  handleBtnKeyDown = event => {
    if (event.keyCode === this.keyCode.DOWN) {
      event.preventDefault();

      this.showMenu();
    }
  };

  handleMenuKeyDown = e => {
    const { keyCode } = e;

    let flag;
    const { DOWN, UP, PAGEDOWN, PAGEUP, HOME, END } = this.keyCode;

    switch (e.keyCode) {
      case DOWN:
        flag = true;
        this.focusNext();
        break;
      case UP:
        flag = true;
        this.focusPrev();
        break;

      case PAGEUP:
      case HOME:
        flag = true;
        this.focusFirst();
        break;
      case PAGEDOWN:
      case END:
        flag = true;
        this.focusLast();
        break;
    }

    if (flag) {
      e.preventDefault();
    }

    // Close on escape or tab
    if (keyCode === this.keyCode.ESC || keyCode === this.keyCode.TAB) {
      this.toggle();
    }

    // If escape, refocus menu button
    if (keyCode === this.keyCode.ESC) {
      e.preventDefault();
      this.btn.focus();
    }
  };

  focusNext() {
    const index = this.index + 1;
    if (index > this.items.length - 1) {
      return this.focusFirst();
    }
    const nextEl = this.items[index];
    nextEl.focus();
    this.index += 1;
  }

  focusPrev() {
    const index = this.index - 1;
    if (index === -1) {
      return this.focusLast();
    }
    const nextEl = this.items[index];
    nextEl.focus();
    this.index -= 1;
  }

  handleWindowClick = e => {
    const node = this.elem;

    // if the target isn't the button or contains the button, the click is outside
    // the data-dropdown element
    if (event.target !== node && !node.contains(event.target)) {
      this.hideMenu();
    }
  };

  toggle = () => {
    if (this.isOpen) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  };

  focusFirst() {
    this.index = 0;
    this.firstItem.focus();
  }

  focusLast() {
    this.index = this.items.length - 1;
    this.lastItem.focus();
  }

  hideMenu() {
    off(window, 'click', this.handleWindowClick);
    off(window, 'touchstart', this.handleWindowClick);
    off(this.menu, 'keydown', this.handleMenuKeyDown);

    this.elem.classList.remove(this.activeClass);
    this.btn.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
  }

  showMenu() {
    /**
     * listen for window clicks/touch so we can close the dropdown on clicks outside
     * dropdown and button.
     */
    on(window, 'click', this.handleWindowClick);
    on(window, 'touchstart', this.handleWindowClick);
    on(this.menu, 'keydown', this.handleMenuKeyDown);

    this.elem.classList.add(this.activeClass);
    this.btn.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    this.focusFirst();
  }
}

const elems = $$('[data-dropdown]');

[].forEach.call(elems, elem => new Dropdown(elem));

export default Dropdown;

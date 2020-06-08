import { $, $$, on } from './utils/dom';

/**
 * Updates the window url from another input value after clicking the button (or other) element.
 *
 * Example:
 *
 * <select>
 *   <option value="http://middlebury.edu">Middlebury</option>
 * </select>
 * <button data-select-url=".js-dropdown">go</button>
 *
 * After a user changes the select option, they can click the go button to navigate to that
 * select option value.
 *
 * Basically, this is a bad way to recreate a native anchor link.
 */

function handleElemClick(event) {
  event.preventDefault();

  const selector = event.target.getAttribute('data-select-url');

  const select = $(selector);

  if (select && select.value) {
    window.location = select.value;
  }
}

const els = $$('[data-select-url]');

els.forEach(el => on(el, 'click', handleElemClick));

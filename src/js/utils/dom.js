/**
 * Collection of jquery-like DOM utility functions for short-hand vanillajs manipulations
 * @file
 */

export const $ = (selector, elem = document) => elem.querySelector(selector);
export const $$ = (selector, elem = document) =>
  elem.querySelectorAll(selector);

export const hide = elem => (elem.style.display = 'none');
export const show = (elem, display = 'block') => (elem.style.display = display);

export const on = (elem, eventType, cb) => elem.addEventListener(eventType, cb);
export const off = (elem, eventType, cb) =>
  elem.removeEventListener(eventType, cb);

export const addClass = (elem, className) => elem.classList.add(className);
export const removeClass = (elem, className) =>
  elem.classList.remove(className);
export const toggleClass = (elem, className) =>
  elem.classList.toggle(className);
export const hasClass = (elem, className) => elem.classList.contains(className);

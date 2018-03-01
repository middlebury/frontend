import config from '../config';

const {breakpoints} = config;

const isMedia = size =>
  window.matchMedia(`(min-width: ${breakpoints[size]}px)`).matches;

export default isMedia;

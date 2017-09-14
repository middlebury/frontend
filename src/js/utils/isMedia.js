const breakpoints = {
  xs: 0,
  sm: 580,
  md: 960,
  lg: 1200,
  xl: 1440
};

const isMedia = size =>
  window.matchMedia(`(min-width: ${breakpoints[size]}px)`).matches;

export default isMedia;

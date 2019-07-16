// polyfills
import 'intersection-observer';
import objectFitImages from 'object-fit-images';

// polyfills for micromodal ie11 support
import 'mdn-polyfills/Object.assign';
import 'mdn-polyfills/Array.from';

// import './publications';
import './chart-loader';
import './events-datepicker';
import './modal';
import './nav';
import './program-spotlight';
import './responsive-tables';
import './slideshow';
import './toggler';
import './video';
import './dropdown';
import './degree-popup';

objectFitImages();

/**
 * Handles showing the city/state/zip fields on the Pardot form handler
 */
function pardotFormHandler() {
  const select = document.querySelector('.js-pardot-country-select');
  const fields = document.querySelector('.js-pardot-country-us-fields');

  if (!select || !fields) {
    return;
  }

  fields.style.display = 'none';

  select.onchange = event => {
    if (event.target.value === 'US') {
      fields.style.display = 'block';
    } else {
      fields.style.display = 'none';
    }
  };
}

pardotFormHandler();

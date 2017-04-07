import Modal from './modal';

function createButton(select) {
  const button = document.createElement('button');

  button.classList = select.classList;

  const options = select.querySelectorAll('option');

  if (options && options.length) {
    button.appendChild(document.createTextNode(options[0].innerText));
  }

  return button;
}

function main(select) {
  select.style.display = 'none';

  const button = createButton(select);

  select.parentElement.appendChild(button);

  const modal = new Modal('#mission-modal');

  button.addEventListener('click', e => {
    e.preventDefault();
    modal.open();
  });
}

const select = document.querySelector('.js-mission-selector');

if (select) {
  main(select);
}

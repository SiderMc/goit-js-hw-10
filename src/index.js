import './css/styles.css';
import { getData } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  position: 'center-top',
  fontSize: '18px',
  timeout: 2000,
  cssAnimationStyle: 'from-top',
  width: '350px',
});

const DEBOUNCE_DELAY = 300;
const form = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

form.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput() {
  const country = form.value.trim();
  getData(country).then(handleSuccess).catch(handleError);
}

function handleSuccess(data) {
  clearLists();

  if (data.length === 1) {
    info.innerHTML = getSingleCountryInfo(data[0]);
    info.classList.add('visible');
  } else if (data.length > 1) {
    if (data.length <= 10 && data.length >= 2) {
      list.innerHTML = data.map(getMultipleCountryInfo).join('');
    } else {
      Notify.info('Too many matches found. Please enter a more specific name.');
    }
  }
}

function handleError(error) {
  clearLists();
  if (error.message === '404') {
    return Notify.failure('Oops, there is no country with that name');
  }
  Notify.failure(`${error.message}`);
}

function clearLists() {
  list.innerHTML = '';
  info.innerHTML = '';
  info.classList.remove('visible');
}

function getMultipleCountryInfo({ flags, name: { official, common } }) {
  const svgBig = flags.find(flag => flag.endsWith('.svg'));
  return `
    <li class="country-list-item">
      <img class="country-small-flag" src="${svgBig}" alt="${official}">
      <p class="country-small-text">${common}</p>
    </li>
  `;
}

function getSingleCountryInfo({
  capital,
  population,
  languages,
  flags,
  name: { official },
}) {
  const svg = flags.find(flag => flag.endsWith('.svg'));

  return `
    <img class="country-big-flag" src="${svg}" alt="${official}">
    <h2 class="country-name">${official}</h2>
    <p class="country-title">
      Capital:
      <span class="country-item">${capital}</span>
    </p>
    <p class="country-title">
      Population:
      <span class="country-item">${population}</span>
    </p>
    <p class="country-title">
      Languages:
      <span class="country-item">${Object.values(languages).join(',')}</span>
    </p>
  `;
}

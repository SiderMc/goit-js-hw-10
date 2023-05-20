import './css/styles.css';
import { getData } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({
  position: 'center-top',
  fontSize: '18px',
  timeout: 3000,
  cssAnimationStyle: 'from-top',
  width: '350px',
});

const DEBOUNCE_DELAY = 300;
const form = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

form.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput() {
  const country = getCountry();
  if (country) {
    getData(country);
  } else {
    clearLists();
  }
}

function getCountry() {
  if (form.value.trim() !== '') {
    return form.value;
  }
}

function clearLists() {
  list.innerHTML = '';
  info.innerHTML = '';
  info.classList.remove('visible');
}

function getValues(data) {
  clearLists();

  if (data.length === 1) {
    info.innerHTML = getSingleCountryInfo(data[0]);
    info.classList.add('visible');
  } else if (data.length > 1) {
    if (data.length <= 10) {
      list.innerHTML = data.map(getMultipleCountryInfo).join('');
      list.classList.add('animate');
    } else {
      Notify.info('Too many matches found. Please enter a more specific name.');
    }
  }
}

function getMultipleCountryInfo({
  flags: { svg },
  name: { official, common },
}) {
  return `
    <li class="country-list-item">
      <img class="country-small-flag" src="${svg}" alt="${official}">
      <p class="country-small-text">${common}</p>
    </li>
  `;
}

function getSingleCountryInfo({
  capital,
  population,
  languages,
  flags: { svg },
  name: { official },
}) {
  return `
    <img class="country-big-flag" src="${svg}" alt="${official}">
    <h2 class="country-name">${official}</h2>
    <p class="country-title">
      Capital :
      <span class="country-item">${capital}</span>
    </p>
    <p class="country-title">
      Population :
      <span class="country-item">${population}</span>
    </p>
    <p class="country-title">
      Languages :
      <span class="country-item">${Object.values(languages)}</span>
    </p>
  `;
}

export { getCountry, getValues };

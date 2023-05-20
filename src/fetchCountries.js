import { getCountry } from './index.js';
import { getValues } from './index.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
export { getData };

function getData() {
  return fetch(`https://restcountries.com/v3.1/name/${getCountry()}`)
    .then(response => {
      if (response.status === 404) {
        throw new Error('Not found');
      }
      return response.json();
    })
    .then(data => getValues(data))
    .catch(error => {
      console.error(error);
      Notify.failure('Oops, there is no country with that name');
    });
}

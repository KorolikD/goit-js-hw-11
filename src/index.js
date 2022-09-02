import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const searchQuery = e.target.value.trim();

  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(data => {
      if (data.length > 10) {
        clearMarkup();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        clearMarkup();
        createCountryListMarkup(data);
      } else if (data.length === 1) {
        clearMarkup();
        createCountryInfoMarkup(data);
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Ooops, there is no contry with that name')
    );
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function createCountryListMarkup(countrys) {
  const markup = countrys
    .map(
      ({ flags, name }) =>
        `
        <li class="country-list-item">
          <img src="${flags.svg}" alt="flag">
          <p>${name.official}</p>
        </li>
        `
    )
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function createCountryInfoMarkup(countrys) {
  const markup = countrys
    .map(
      ({ flags, name, capital, population, languages }) =>
        `
        <div class="country-name">
          <img src="${flags.svg}" alt="flag" />
          <span>${name.official}</span>
        </div>
        <div class="capital"><span>Capital:</span> ${capital}</div>
        <div class="population"><span>Population: </span> ${population}</div>
        <div class="languages"><span>Languages: </span> ${Object.values(
          languages
        )} </div>
        `
    )
    .join('')
    .replaceAll(',', ', ');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

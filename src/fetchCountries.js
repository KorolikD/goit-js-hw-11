export default function fetchCountries(countryInput) {
  const url = `https://restcountries.com/v3.1/name/${countryInput}`;
  const paramsOfResponse = '?fields=name,capital,population,flags,languages';

  return fetch(`${url}${paramsOfResponse}`).then(r => {
    if (!r.ok) {
      return;
    }
    return r.json();
  });
}

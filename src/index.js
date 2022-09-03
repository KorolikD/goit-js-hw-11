import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import fatchImages from './fetchImages';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSubmitButton);

function onSubmitButton(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  clearMarkup();

  fatchImages(searchQuery)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        return data.hits;
      }
    })
    .then(searchQuery => {
      createGalleryCardMarkup(searchQuery);
    });
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function createGalleryCardMarkup(searchQuery) {
  const markup = searchQuery
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
          <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b> </br>${likes}
              </p>
              <p class="info-item">
                <b>Views</b> </br>${views}
              </p>
              <p class="info-item">
                <b>Comments</b> </br>${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b> </br>${downloads}
              </p>
            </div>
          </div>
          `
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

// function onInput(e) {
//   const searchQuery = e.target.value.trim();

//   if (searchQuery === '') {
//     clearMarkup();
//     return;
//   }

//   fetchCountriesAndUpdateUi(searchQuery);
// }

// async function fetchCountriesAndUpdateUi(searchQuery) {
//   try {
//     const data = await fetchCountries(searchQuery);

//     if (data.length > 10) {
//       clearMarkup();
//       Notiflix.Notify.info(
//         'Too many matches found. Please enter a more specific name.'
//       );
//     } else if (data.length >= 2 && data.length <= 10) {
//       clearMarkup();
//       createCountryListMarkup(data);
//     } else if (data.length === 1) {
//       clearMarkup();
//       createCountryInfoMarkup(data);
//     }
//   } catch (error) {
//     Notiflix.Notify.failure('Ooops, there is no contry with that name');
//   }
// }

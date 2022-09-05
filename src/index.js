import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiService from './pixabay-service';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSubmitButton);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSubmitButton(e) {
  e.preventDefault();

  pixabayApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  pixabayApiService.resetPage();

  if (pixabayApiService.query === '') {
    return;
  }
  fetchAfterSubmit();
}

async function fetchAfterSubmit() {
  try {
    const responseData = await pixabayApiService.fatchImages();

    if (responseData.totalHits < 40) {
      loadMoreBtnHiden();
    } else {
      loadMoreBtnShow();
    }

    if (responseData.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (responseData.totalHits > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${responseData.totalHits} images.`
      );
    }

    const responseDataArr = await responseData.hits;
    clearMarkup();

    appendGaleryCardsMarkup(responseDataArr);
    lightboxOn();
    scrollToStart();
  } catch (error) {
    return;
  }
}

async function onLoadMoreBtn() {
  const responseData = await pixabayApiService.fatchImages();

  if (responseData.hits.length < 40) {
    loadMoreBtnHiden();
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else if (pixabayApiService.totalCards > 0) {
    Notiflix.Notify.success(
      `You can load ${pixabayApiService.totalCards} images.`
    );
  }

  const responseDataArr = await responseData.hits;
  appendGaleryCardsMarkup(responseDataArr);
  lightboxOn();
  scrollToEnd();
}

function appendGaleryCardsMarkup(searchQueryData) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    galleryCardTemplate(searchQueryData)
  );
}

function galleryCardTemplate(data) {
  const markup = data
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
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
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
  return markup;
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function loadMoreBtnShow() {
  refs.loadMoreBtn.classList.remove('is-hiden');
}

function loadMoreBtnHiden() {
  refs.loadMoreBtn.classList.add('is-hiden');
}

function lightboxOn() {
  const lightbox = new SimpleLightbox('.gallery a', {
    // captionType: 'attr',
    // captionsData: 'alt',
    animationSpeed: 250,
  });
}

function scrollToEnd() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function scrollToStart() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

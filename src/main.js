import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = document.querySelector("input[name='search-text']");
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalPages = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();

  query = input.value.trim();
  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    if (data.hits.length === 0) {
      iziToast.info({ message: 'No images found.' });
      return;
    }

    createGallery(data.hits);
    totalPages = Math.ceil(data.totalHits / 15);

    if (page < totalPages) showLoadMoreButton();
  } catch {
    iziToast.error({ message: 'Error fetching data' });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch {
    iziToast.error({ message: 'Error loading more images' });
  } finally {
    hideLoader();
  }
}

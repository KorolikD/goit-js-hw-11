import axios from 'axios';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.limit = 40;
    this.totalCards;
  }

  async fatchImages() {
    const KEY = '29563680-7212c18ac3d60535e0c53b281';
    const url = 'https://pixabay.com/api/';
    const paramsOfResponse = `?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.limit}`;

    const response = await axios.get(`${url}${paramsOfResponse}`);
    const responseData = await response.data;

    try {
      this.totalCards = responseData.totalHits;

      this.totalCards = responseData.totalHits - this.page * this.limit;
      this.incrementPage();

      return responseData;
    } catch (e) {}
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

export default async function fatchImages(searchQuery) {
  const KEY = '29563680-7212c18ac3d60535e0c53b281';

  const url = 'https://pixabay.com/api/';
  const paramsOfResponse = `?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;

  const response = await fetch(`${url}${paramsOfResponse}`);
  return await response.json();
}

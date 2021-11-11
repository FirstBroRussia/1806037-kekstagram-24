import {setRenderPhotoMiniatures} from './render-photo-miniatures.js';
import {setShowWindowsWithFilters} from './photo-filtering.js';
import {setShowErrorWhenRequestData} from './functions-to-module-api.js';

const URL_API_FROM_SERVER = 'https://24.javascript.pages.academy/kekstagram/data';
const URL_API_TO_SERVER = 'https://24.javascript.pages.academy/kekstagram';

function setDataFromServer (onSuccess, onFail) {
  return fetch(URL_API_FROM_SERVER)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка в получении данных с сервера. Попробуйте обновить страницу.');
      }
      return response.json();
    })
    .then((data) => {
      onSuccess(data.slice());
      setShowWindowsWithFilters(data);
    })
    .catch((err) => onFail(err));
}


setDataFromServer(setRenderPhotoMiniatures, setShowErrorWhenRequestData);


// =========================================================================================

function setDataToServer (onSuccess, onFail) {
  return fetch(URL_API_TO_SERVER,
    {
      method: 'POST',
      credentials: 'same-origin',
      body: new FormData(document.querySelector('.img-upload__form')),
    })
    .then( (response) => {
      if (response.status === 200) {
        onSuccess();
      } else {
        throw new Error();
      }
    })
    .catch( () => {
      onFail();
    });
}


export {setDataToServer};

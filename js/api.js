import {setRenderPhotoMuniatures} from './render-photo-miniatures.js';
import {editorUploadPhoto} from './form.js';

function setDataFromServer (onSuccess, onFail) {
  return fetch('https://24.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (!response.ok) {
        throw new Error('Ошибка в получении данных с сервера. Попробуйте обновить страницу.');
      }
    })
    .then((data) => onSuccess(data.slice()))
    .catch((err) => onFail(err));
}

function setShowErrorWhenRequestData (err) {
  document.querySelector('.error-window').classList.remove('hidden');
  document.querySelector('.error-window').classList.add('flex');
  document.querySelector('.error-text').textContent = err;
}

setDataFromServer(setRenderPhotoMuniatures, setShowErrorWhenRequestData);


// =========================================================================================

function setDataToServer (onSuccess, onFail) {
  return fetch('https://24.javascript.pages.academy/kekstagram',
    {
      method: 'POST',
      credentials: 'same-origin',
      body: new FormData(document.querySelector('.img-upload__form')),
    })
    .then( (response) => {
      if (response.status === 200) {
        console.log(response.status);
        //onSuccess();
      }
    })
    .catch( () => {
      onFail();
    });
}

function setSuccessUploadPhotos () {
  editorUploadPhoto.classList.add('hidden');
}

export {setDataToServer};

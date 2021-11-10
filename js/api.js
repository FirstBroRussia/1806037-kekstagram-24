/* eslint-disable no-use-before-define */
import {setRenderPhotoMuniatures} from './render-photo-miniatures.js';
import {setCloseEditorWindow, fileUploaderButton} from './form.js';
import {bodyList} from './render-full-picture.js';
import { isEscapeKey } from './util.js';
import { setShowWindowsWithFilters } from './photo-filtering.js';

const errorTemplate = document.querySelector('#error').content.querySelector('.error__inner');
const successTemplate = document.querySelector('#success').content.querySelector('.success__inner');

function setDataFromServer (onSuccess, onFail) {
  return fetch('https://24.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (!response.ok) {
        throw new Error('Ошибка в получении данных с сервера. Попробуйте обновить страницу.');
      }
    })
    .then((data) => {
      onSuccess(data.slice());
      setShowWindowsWithFilters(data);
    })
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
        onSuccess();
      } else {
        throw new Error();
      }
    })
    .catch( () => {
      onFail();
    });
}

function setSuccessToUploadPhotos () {
  setCloseEditorWindow();
  document.querySelector('.img-upload__message').remove();
  setSuccessPopup();
}


function setSuccessPopup () {
  bodyList.classList.add('modal-open');
  successTemplate.classList.remove('hidden');
  bodyList.appendChild(successTemplate);

  document.addEventListener('keydown', setCloseByKeydownSuccessPopup);
  document.addEventListener('click', setCloseByClickSuccessPopup);

  function setOperationToCloseSuccessPopup () {
    bodyList.classList.remove('modal-open');
    successTemplate.remove();
    document.removeEventListener('keydown', setCloseByKeydownSuccessPopup);
    document.removeEventListener('click', setCloseByClickSuccessPopup);
  }

  function setCloseByClickSuccessPopup (evt) {
    if (!evt.target.closest('[class^="success__"]')) {
      setOperationToCloseSuccessPopup();
    } else if (evt.target.closest('[class="success__button"]')) {
      setOperationToCloseSuccessPopup();
    }
  }

  function setCloseByKeydownSuccessPopup (evt) {
    if (isEscapeKey(evt)) {
      setOperationToCloseSuccessPopup();
    }
  }

}

function setErrorToUploadPhotos () {
  setCloseEditorWindow();
  document.querySelector('.img-upload__message').remove();
  setErrorPopup();
}

function setErrorPopup () {
  bodyList.classList.add('modal-open');
  errorTemplate.classList.remove('hidden');
  bodyList.appendChild(errorTemplate);

  document.addEventListener('keydown', setCloseByKeydownErrorPopup);
  document.addEventListener('click', setCloseByClickErrorPopup);

  function setCloseByClickErrorPopup (evt) {
    if (!evt.target.closest('[class^="error__"]')) {
      setOperationToCloseErrorPopup();
    } else if (evt.target.closest('[class="error__button"]')) {
      fileUploaderButton.click();
    }
  }

  function setCloseByKeydownErrorPopup (evt) {
    if (isEscapeKey(evt)) {
      setOperationToCloseErrorPopup();
    }
  }

  function setOperationToCloseErrorPopup () {
    bodyList.classList.remove('modal-open');
    errorTemplate.remove();
    document.removeEventListener('keydown', setCloseByKeydownErrorPopup);
    document.removeEventListener('click', setCloseByClickErrorPopup);
  }
}

export {setDataToServer, setSuccessToUploadPhotos, setErrorToUploadPhotos};

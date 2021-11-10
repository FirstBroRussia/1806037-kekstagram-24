/* eslint-disable no-use-before-define */
import {setCloseEditorWindow, fileUploaderButton} from './form.js';
import {bodyList} from './render-full-picture.js';
import {isEscapeKey} from './util.js';


const errorTemplate = document.querySelector('#error').content.querySelector('.error__inner');
const successTemplate = document.querySelector('#success').content.querySelector('.success__inner');

function setShowErrorWhenRequestData (err) {
  document.querySelector('.error-window').classList.remove('hidden');
  document.querySelector('.error-window').classList.add('flex');
  document.querySelector('.error-text').textContent = err;
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


export {setShowErrorWhenRequestData, setSuccessToUploadPhotos, setErrorToUploadPhotos};

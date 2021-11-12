/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import {setCloseEditorWindow, fileUploaderButton} from './form.js';
import {bodyContent} from './render-full-picture.js';
import {isEscapeKey} from './util.js';


const errorTemplate = document.querySelector('#error').content.querySelector('.error__inner');
const successTemplate = document.querySelector('#success').content.querySelector('.success__inner');

function setShowErrorWhenRequestData (onError) {
  document.querySelector('.error-window').classList.remove('hidden');
  document.querySelector('.error-window').classList.add('flex');
  document.querySelector('.error-text').textContent = onError;
}

const setSuccessToUploadPhotos = () => {
  setCloseEditorWindow();
  document.querySelector('.img-upload__message').remove();
  setSuccessPopup();
};


const setSuccessPopup = () => {
  bodyContent.classList.add('modal-open');
  successTemplate.classList.remove('hidden');
  bodyContent.appendChild(successTemplate);

  const closeSuccessPopupEscapeKeyDownAddHandler = document.addEventListener('keydown', setCloseByKeydownSuccessPopup);
  const closeSuccessPopupClickAddHandler = document.addEventListener('click', setCloseByClickSuccessPopup);

  function setOperationToCloseSuccessPopup () {
    bodyContent.classList.remove('modal-open');
    successTemplate.remove();
    const closeSuccessPopupEscapeKeyDownRemoveHandler = document.removeEventListener('keydown', setCloseByKeydownSuccessPopup);
    const closeSuccessPopupClickRemoveHandler = document.removeEventListener('click', setCloseByClickSuccessPopup);
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
};

const setErrorToUploadPhotos = () => {
  setCloseEditorWindow();
  document.querySelector('.img-upload__message').remove();
  setErrorPopup();
};

const setErrorPopup = () => {
  bodyContent.classList.add('modal-open');
  errorTemplate.classList.remove('hidden');
  bodyContent.appendChild(errorTemplate);

  const closeErrorPopupEscapeKewdownAddHandler = document.addEventListener('keydown', setCloseByKeydownErrorPopup);
  const closeErrorPopupClickAddHandler = document.addEventListener('click', setCloseByClickErrorPopup);

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
    bodyContent.classList.remove('modal-open');
    errorTemplate.remove();
    const closeErrorPopupEscapeKewdownRemoveHandler = document.removeEventListener('keydown', setCloseByKeydownErrorPopup);
    const closeErrorPopupClickRemoveHandler = document.removeEventListener('click', setCloseByClickErrorPopup);
  }
};


export {setShowErrorWhenRequestData, setSuccessToUploadPhotos, setErrorToUploadPhotos};

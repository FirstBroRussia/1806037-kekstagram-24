/* eslint-disable no-use-before-define */
import {setCloseUploadWindowHandler, fileUploaderButton} from './form.js';
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
  setCloseUploadWindowHandler();
  document.querySelector('.img-upload__message').remove();
  setSuccessPopup();
};


const setSuccessPopup = () => {
  bodyContent.classList.add('modal-open');
  successTemplate.classList.remove('hidden');
  bodyContent.appendChild(successTemplate);

  document.addEventListener('keydown', setCloseSuccessPopupEscapeKeyDownHandler);
  document.addEventListener('click', setCloseSuccessPopupClickHandler);

  const setOperationToCloseSuccessPopup = () => {
    bodyContent.classList.remove('modal-open');
    successTemplate.remove();
    document.removeEventListener('keydown', setCloseSuccessPopupEscapeKeyDownHandler);
    document.removeEventListener('click', setCloseSuccessPopupClickHandler);
  };

  function setCloseSuccessPopupClickHandler (evt) {
    if (!evt.target.closest('[class^="success__"]')) {
      setOperationToCloseSuccessPopup();
    } else if (evt.target.closest('[class="success__button"]')) {
      setOperationToCloseSuccessPopup();
    }
  }

  function setCloseSuccessPopupEscapeKeyDownHandler (evt) {
    if (isEscapeKey(evt)) {
      setOperationToCloseSuccessPopup();
    }
  }
};

const setErrorToUploadPhotos = () => {
  setCloseUploadWindowHandler();
  document.querySelector('.img-upload__message').remove();
  setErrorPopup();
};

const setErrorPopup = () => {
  bodyContent.classList.add('modal-open');
  errorTemplate.classList.remove('hidden');
  bodyContent.appendChild(errorTemplate);

  document.addEventListener('keydown', setCloseErrorPopupEscapeKewdownHandler);
  document.addEventListener('click', setCloseErrorPopupClickHandler);

  function setCloseErrorPopupClickHandler (evt) {
    if (!evt.target.closest('[class^="error__"]')) {
      setOperationToCloseErrorPopup();
    } else if (evt.target.closest('[class="error__button"]')) {
      fileUploaderButton.click();
    }
  }

  function setCloseErrorPopupEscapeKewdownHandler (evt) {
    if (isEscapeKey(evt)) {
      setOperationToCloseErrorPopup();
    }
  }

  const setOperationToCloseErrorPopup = () => {
    bodyContent.classList.remove('modal-open');
    errorTemplate.remove();
    document.removeEventListener('keydown', setCloseErrorPopupEscapeKewdownHandler);
    document.removeEventListener('click', setCloseErrorPopupClickHandler);
  };
};


export {setShowErrorWhenRequestData, setSuccessToUploadPhotos, setErrorToUploadPhotos};

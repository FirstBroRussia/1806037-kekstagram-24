/* eslint-disable no-use-before-define */

import { isEscapeKey } from './util.js';
import { bodyList } from './render-full-picture.js';
import { regExpList, testArrayToFirstHash, testArrayToMainRegExp, testArrayToASingleCharacterString, testArrayToSameHashTags, deleteEmptyElement } from './functions-to-module-form.js';


const fileUploader = document.querySelector('#upload-file');
const currentImageUpload = document.createElement('img');
const imagePreview = document.querySelector('.img-upload__preview').querySelector('img');
const editorUploadPhoto = document.querySelector('.img-upload__overlay');
const buttonCloseUploadWindow = document.querySelector('.img-upload__cancel');
const buttonSubmitForm = document.querySelector('.img-upload__submit');
const lengthTextComment = document.querySelector('.text-comment__length');
const textComment = document.querySelector('.text__description');
const inputTextHashTags = document.querySelector('.text__hashtags');

const MAX_LENGTH_TEXT_COMMENT_AREA = 140;
const MAX_QUANTITY_HASH_TAGS = 5;

function closeUploadWindowEscKeydown (evt) {
  if (isEscapeKey(evt)) {
    closeEditorWindow();
  }
}

function closeEditorWindow () {
  bodyList.classList.remove('modal-open');
  editorUploadPhoto.classList.add('hidden');
  fileUploader.value = '';
  inputTextHashTags.value = '';
  textComment.textContent = '';
  lengthTextComment.textContent = '0/140';

  buttonCloseUploadWindow.removeEventListener('click', closeEditorWindow);
  document.removeEventListener('keydown', closeUploadWindowEscKeydown);
}

function openEditorWindow () {
  bodyList.classList.add('modal-open');
  editorUploadPhoto.classList.remove('hidden');
  buttonCloseUploadWindow.addEventListener('click', closeEditorWindow);
  document.addEventListener('keydown', closeUploadWindowEscKeydown);
}


function getImageUploaded (evt) {
  const files = evt.target.files;
  currentImageUpload.src = URL.createObjectURL(files[0]);
  currentImageUpload.alt = files[0].name;
}


fileUploader.addEventListener('change', (evt) => {
  getImageUploaded(evt);
  imagePreview.src = currentImageUpload.src;
  openEditorWindow();
});


textComment.addEventListener ('input', () => {
  const textCommentValue = textComment.value;
  lengthTextComment.textContent = `${textCommentValue.length}/${MAX_LENGTH_TEXT_COMMENT_AREA}`;
});

textComment.addEventListener('focus', () => {
  document.removeEventListener('keydown', closeUploadWindowEscKeydown);
});

textComment.addEventListener('focusout', () => {
  document.addEventListener('keydown', closeUploadWindowEscKeydown);
});


// Input поля ХЕШТЕГОВ -----------------------------------------------------


function validationCheckForInput (itemsTextHashTags, valueTextHashTags, itemsRegExp) {
  if (itemsTextHashTags.some(testArrayToFirstHash)) {
    return 'Хеш-тег должен начинаться с символа # (решётка)';
  } else {
    if (itemsRegExp.regExpOverOneHash.test(valueTextHashTags) || itemsRegExp.regExpNoSpaceBeforeHash.test(valueTextHashTags)) {
      return 'Между хеш-тегами обязан быть один пробел';
    } else if (itemsRegExp.regExpOneHash.test(valueTextHashTags)) {
      return 'Хеш-тег не может состоять только из одной решётки (#)';
    } else if (itemsTextHashTags.length > MAX_QUANTITY_HASH_TAGS) {
      return 'Не более пяти хеш-тегов';
    } else {
      return '';
    }
  }
}

function validationCheckForSubmit (itemsTextHashTags) {
  if (itemsTextHashTags.some(testArrayToASingleCharacterString)) {
    return 'Хеш-тег не может состоять только из одного символа # (решётка)';
  } else if (testArrayToSameHashTags(itemsTextHashTags)) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  } else if (itemsTextHashTags.some(testArrayToMainRegExp)) {
    return 'Хеш-тег не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.';
  } else {
    return '';
  }
}


inputTextHashTags.addEventListener('input', () => {
  const valueTextHashTags = inputTextHashTags.value.toLowerCase();
  const lineTextHashTags = valueTextHashTags.split(' ');
  const refreshItemsTextHashTags = deleteEmptyElement(lineTextHashTags);
  inputTextHashTags.setCustomValidity(validationCheckForInput(refreshItemsTextHashTags, valueTextHashTags, regExpList));
  inputTextHashTags.reportValidity();

  buttonSubmitForm.addEventListener('click', () => {

    inputTextHashTags.setCustomValidity(validationCheckForSubmit(refreshItemsTextHashTags));
    inputTextHashTags.reportValidity();
  });

});


inputTextHashTags.addEventListener('focus', () => {
  document.removeEventListener('keydown', closeUploadWindowEscKeydown);
});

inputTextHashTags.addEventListener('focusout', () => {
  document.addEventListener('keydown', closeUploadWindowEscKeydown);
});


/* eslint-disable no-constant-condition */
/* eslint-disable no-use-before-define */
import { isEscapeKey } from './util.js';
import { bodyList } from './render-full-picture.js';
import { regExpOverOneSpace, regExpOneHash, regExpOverOneHash, regExpNoSpaceBeforeHash, testArrayToFirstHash, testArrayToMainRegExp, testArrayToASingleCharacterString, testArrayToSameHashTags, deleteEmptyElement } from './functions-to-module-form.js';

// /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/

/* const regExpHashTag = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const regExpOverOneSpace = /\s\s/;
const regExpOneHash = /#\s/;
const regExpOverOneHash = /##/;
const regExpNoSpaceBeforeHash = /\S#/;
const regExpFirstSymbol = /^#/; */

const fileUploader = document.querySelector('#upload-file');
const currentImageUpload = document.createElement('img');
const imagePreview = document.querySelector('.img-upload__preview').querySelector('img');
const editorUploadPhoto = document.querySelector('.img-upload__overlay');
const buttonCloseUploadWindow = document.querySelector('.img-upload__cancel');
const buttonSubmitForm = document.querySelector('.img-upload__submit');
const lengthTextComment = document.querySelector('.text-comment__length');
const textComment = document.querySelector('.text__description');
const textHashTags = document.querySelector('.text__hashtags');


function closeUploadWindowEscKeydown (evt) {
  if (isEscapeKey(evt)) {
    closeEditorWindow();
  }
}

function closeEditorWindow () {
  bodyList.classList.remove('modal-open');
  editorUploadPhoto.classList.add('hidden');
  fileUploader.value = '';
  textHashTags.value = '';
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
  lengthTextComment.textContent = `${textCommentValue.length}/140`;
});

textComment.addEventListener('focus', () => {
  document.removeEventListener('keydown', closeUploadWindowEscKeydown);
});

textComment.addEventListener('focusout', () => {
  document.addEventListener('keydown', closeUploadWindowEscKeydown);
});


// Input поля ХЕШТЕГОВ -----------------------------------------------------

textHashTags.addEventListener('input', () => {
  const valueTextHashTags = textHashTags.value.toLowerCase();
  const arrTextHashTags = valueTextHashTags.split(' ');

  deleteEmptyElement(arrTextHashTags);

  if (arrTextHashTags.some(testArrayToFirstHash)) {
    textHashTags.setCustomValidity('Хеш-тег должен начинаться с символа # (решётка)');
    textHashTags.reportValidity();
  } else {
    if (regExpOverOneSpace.test(valueTextHashTags)) {
      textHashTags.setCustomValidity('Не более одного пробела');
      textHashTags.reportValidity();
    } else if (regExpOverOneHash.test(valueTextHashTags) || regExpNoSpaceBeforeHash.test(valueTextHashTags)) {
      textHashTags.setCustomValidity('Между хеш-тегами обязан быть один пробел');
      textHashTags.reportValidity();
    } else if (regExpOneHash.test(valueTextHashTags)) {
      textHashTags.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
      textHashTags.reportValidity();
    } else if (arrTextHashTags.length > 5) {
      textHashTags.setCustomValidity('Не более пяти хеш-тегов');
      textHashTags.reportValidity();
    } else {
      textHashTags.setCustomValidity('');
    }
  }

  buttonSubmitForm.addEventListener('click', () => {


    if (arrTextHashTags.some(testArrayToASingleCharacterString)) {
      textHashTags.setCustomValidity('Хеш-тег не может состоять только из одного символа # (решётка)');
      textHashTags.reportValidity();
    } else if (testArrayToSameHashTags(arrTextHashTags)) {
      textHashTags.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
      textHashTags.reportValidity();
    } else if (arrTextHashTags.some(testArrayToMainRegExp)) {
      textHashTags.setCustomValidity('Хеш-тег не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.');
      textHashTags.reportValidity();
    } else {
      textHashTags.setCustomValidity('');
    }
  });
});

textHashTags.addEventListener('focus', () => {
  document.removeEventListener('keydown', closeUploadWindowEscKeydown);
});

textHashTags.addEventListener('focusout', () => {
  document.addEventListener('keydown', closeUploadWindowEscKeydown);
});

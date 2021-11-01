/* eslint-disable no-use-before-define */

import { isEscapeKey } from './util.js';
import { bodyList } from './render-full-picture.js';
import { regExpList, testArrayToFirstHash, testArrayToMainRegExp, testArrayToASingleCharacterString, testArrayToSameHashTags, deleteEmptyElement } from './functions-to-module-form.js';
import '/nouislider/nouislider.js';

let itemScale = 100;

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
  placeSliderTag.classList.add('hidden');
  settingEffect('none');


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

// !!!! Применение фильтров и изменение масштаба ------------------------------------------------------------

const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const previewImgUpload = document.querySelector('.img-upload__preview');

// обработчики на кнопки уменьшения и увеличения масштаба загружаемой фотки

function changeTextValueScale () {
  const textValueScale = document.querySelector('.scale__control--value');
  textValueScale.value = `${itemScale}%`;
}

smallerButton.addEventListener('click', () => {
  if (itemScale === 25) {
    smallerButton.disabled = true;
  } else if (itemScale > 25) {
    smallerButton.disabled = false;
    itemScale -= 25;
    changeTextValueScale();
    previewImgUpload.style.transform = `scale(0.${itemScale})`;
  }
  smallerButton.disabled = false;
  document.querySelector('.scale__value').textContent = itemScale;
});

biggerButton.addEventListener('click', () => {
  if (itemScale === 100) {
    biggerButton.disabled = true;
  } else if (itemScale < 100) {
    biggerButton.disabled = false;
    itemScale += 25;
    changeTextValueScale();
    previewImgUpload.style.transform = `scale(0.${itemScale})`;
    if (itemScale === 100) {
      previewImgUpload.style.transform = 'scale(1)';
    }
  }
  biggerButton.disabled = false;
  document.querySelector('.scale__value').textContent = itemScale;
});

// ЭФФЕКТЫ =======================================


const placeSlider = document.querySelector('.effect-level__slider');
const placeSliderTag = document.querySelector('.img-upload__effect-level');
const effectRadio = document.querySelectorAll('.effects__radio');


function settingEffect (item) {
  previewImgUpload.removeAttribute('class');
  previewImgUpload.setAttribute('class', `img-upload__preview effects__preview--${item}`);
}

function updateSlider (currentItemEffect) {
  placeSlider.noUiSlider.updateOptions(currentItemEffect);
}

//-------------------------------------------------------------


noUiSlider.create(placeSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 80,
  step: 1,
  connect: 'lower',
});


// ОБРАБОТЧИК СОБЫТИЯ КЛИКА ПО ЭФФЕКТУ---------------

effectRadio.forEach( (item) => {
  item.addEventListener('click', () => {
    const valueItemEffect = item.value;


    if (valueItemEffect === 'none') {
      placeSliderTag.classList.add('hidden');
      settingEffect(valueItemEffect);
    } else {
      placeSliderTag.classList.remove('hidden');
      settingEffect(valueItemEffect);
      updateSlider(renderingSliderForCurrentEffect(valueItemEffect));
    }

    placeSlider.noUiSlider.on('update', (__, ___, currentItemSlider) => {
      previewImgUpload.style.filter = changingValuesFilterToImgUploadPreview(valueItemEffect, currentItemSlider[0]);
      document.querySelector('.effect__value').textContent = `filter: ${changingValuesFilterToImgUploadPreview(valueItemEffect, currentItemSlider[0])}`;
    });

  });
});

// --------------------------------------------------


function renderingSliderForCurrentEffect (currentEffect) {
  switch (currentEffect) {
    case 'chrome':
      return {
        range: {
          min: 0,
          max: 1,
        },
        step: 0.1,
        start: 1,
      };
    case 'sepia':
      return {
        range: {
          min: 0,
          max: 1,
        },
        step: 0.1,
        start: 1,
      };
    case 'marvin':
      return {
        range: {
          min: 0,
          max: 100,
        },
        step: 1,
        start: 100,
      };
    case 'phobos':
      return {
        range: {
          min: 0,
          max: 3,
        },
        step: 0.1,
        start: 3,
      };
    case 'heat':
      return {
        range: {
          min: 1,
          max: 3,
        },
        step: 0.1,
        start: 3,
      };
    case 'none':
      break;
  }
}


function changingValuesFilterToImgUploadPreview (currentEffect, currentItemSlider) {
  switch (currentEffect) {
    case 'chrome':
      return `grayscale(${currentItemSlider})`;
    case 'sepia':
      return `sepia(${currentItemSlider})`;
    case 'marvin':
      return `invert(${currentItemSlider}%)`;
    case 'phobos':
      return `blur(${currentItemSlider}px)`;
    case 'heat':
      return `brightness(${currentItemSlider})`;
    case 'none':
      return 'none';
  }
}


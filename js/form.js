/* eslint-disable no-use-before-define */

import { isEscapeKey } from './util.js';
import { bodyList } from './render-full-picture.js';
import { regExpList, setTestArrayToFirstHash, setTestArrayToMainRegExp, setTestArrayToASingleCharacterString, setTestArrayToSameHashTags, setDeleteEmptyElement } from './functions-to-module-form.js';
import { setDataToServer } from './api.js';
import '/nouislider/nouislider.js';

let itemScale = 100;

const form = document.querySelector('.img-upload__form');
const fileUploader = document.querySelector('#upload-file');
const currentImageUpload = document.createElement('img');
const imagePreview = document.querySelector('.img-upload__preview').querySelector('img');
const editorUploadPhoto = document.querySelector('.img-upload__overlay');
const buttonCloseUploadWindow = document.querySelector('.img-upload__cancel');
// const buttonSubmitForm = document.querySelector('.img-upload__submit');
const lengthTextComment = document.querySelector('.text-comment__length');
const textComment = document.querySelector('.text__description');
const inputTextHashTags = document.querySelector('.text__hashtags');


const MAX_LENGTH_TEXT_COMMENT_AREA = 140;
const MAX_QUANTITY_HASH_TAGS = 5;
const MIN_ITEM_SCALE = 25;
const MAX_ITEM_SCALE = 100;
const STEP_ITEM_SCALE = 25;

function setCloseUploadWindowEscKeydown (evt) {
  if (isEscapeKey(evt)) {
    setCloseEditorWindow();
  }
}

function setCloseEditorWindow () {
  bodyList.classList.remove('modal-open');
  editorUploadPhoto.classList.add('hidden');
  fileUploader.value = '';
  inputTextHashTags.value = '';
  textComment.textContent = '';
  lengthTextComment.textContent = '0/140';
  placeSliderTag.classList.add('hidden');
  setEffect('none');


  buttonCloseUploadWindow.removeEventListener('click', setCloseEditorWindow);
  document.removeEventListener('keydown', setCloseUploadWindowEscKeydown);
}

function setOpenEditorWindow () {
  bodyList.classList.add('modal-open');
  editorUploadPhoto.classList.remove('hidden');
  buttonCloseUploadWindow.addEventListener('click', setCloseEditorWindow);
  document.addEventListener('keydown', setCloseUploadWindowEscKeydown);
}


function setImageUploaded (evt) {
  const files = evt.target.files;
  currentImageUpload.src = URL.createObjectURL(files[0]);
  currentImageUpload.alt = files[0].name;
}


fileUploader.addEventListener('change', (evt) => {
  setImageUploaded(evt);
  imagePreview.src = currentImageUpload.src;
  setOpenEditorWindow();
});


textComment.addEventListener ('input', () => {
  const textCommentValue = textComment.value;
  lengthTextComment.textContent = `${textCommentValue.length}/${MAX_LENGTH_TEXT_COMMENT_AREA}`;
});

textComment.addEventListener('focus', () => {
  document.removeEventListener('keydown', setCloseUploadWindowEscKeydown);
});

textComment.addEventListener('focusout', () => {
  document.addEventListener('keydown', setCloseUploadWindowEscKeydown);
});


// Input поля ХЕШТЕГОВ -----------------------------------------------------


function setValidationCheckForInput (itemsTextHashTags, valueTextHashTags, itemsRegExp) {
  if (itemsTextHashTags.some(setTestArrayToFirstHash)) {
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

function setValidationCheckForSubmit (itemsTextHashTags) {
  if (itemsTextHashTags.some(setTestArrayToASingleCharacterString)) {
    return 'Хеш-тег не может состоять только из одного символа # (решётка)';
  } else if (setTestArrayToSameHashTags(itemsTextHashTags)) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  } else if (itemsTextHashTags.some(setTestArrayToMainRegExp)) {
    return 'Хеш-тег не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.';
  } else {
    return '';
  }
}

function setUniqueOperationsOverInputValueHashTags () {
  const valueTextHashTags = inputTextHashTags.value.toLowerCase();
  const lineTextHashTags = valueTextHashTags.split(' ');
  const refreshItemsTextHashTags = setDeleteEmptyElement(lineTextHashTags);
  return [refreshItemsTextHashTags, valueTextHashTags];
}

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const returnValue = setUniqueOperationsOverInputValueHashTags();
  inputTextHashTags.setCustomValidity(setValidationCheckForSubmit(returnValue[0]));
  if (!inputTextHashTags.validity.valid) {
    inputTextHashTags.classList.add('border-hash-tags');
    inputTextHashTags.reportValidity();
  } else {
    inputTextHashTags.classList.remove('border-hash-tags');
    setDataToServer();
  }
});

inputTextHashTags.addEventListener('input', () => {
  const returnValue = setUniqueOperationsOverInputValueHashTags();
  inputTextHashTags.setCustomValidity(setValidationCheckForInput(returnValue[0], returnValue[1], regExpList));
  inputTextHashTags.reportValidity();
});


inputTextHashTags.addEventListener('focus', () => {
  document.removeEventListener('keydown', setCloseUploadWindowEscKeydown);
});

inputTextHashTags.addEventListener('focusout', () => {
  document.addEventListener('keydown', setCloseUploadWindowEscKeydown);
});

// !!!! Применение эффектов и изменение масштаба ------------------------------------------------------------

const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const previewImgUpload = document.querySelector('.img-upload__preview');


// обработчики на кнопки уменьшения и увеличения масштаба загружаемой фотки

function setStyleTransform () {
  previewImgUpload.style.transform = `scale(${itemScale/100})`;
}

function setChangeTextValueScale () {
  const textValueScale = document.querySelector('.scale__control--value');
  textValueScale.value = `${itemScale}%`;
}

smallerButton.addEventListener('click', () => {
  if (itemScale === MIN_ITEM_SCALE) {
    smallerButton.disabled = true;
  } else if (itemScale > MIN_ITEM_SCALE) {
    itemScale -= STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  smallerButton.disabled = false;
  document.querySelector('.scale__value').textContent = itemScale;
});

biggerButton.addEventListener('click', () => {
  if (itemScale === MAX_ITEM_SCALE) {
    biggerButton.disabled = true;
  } else if (itemScale < MAX_ITEM_SCALE) {
    itemScale += STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  biggerButton.disabled = false;
  document.querySelector('.scale__value').textContent = itemScale;
});

// ЭФФЕКТЫ =======================================


const placeSlider = document.querySelector('.effect-level__slider');
const placeSliderTag = document.querySelector('.img-upload__effect-level');
const effectRadio = document.querySelectorAll('.effects__radio');
const inputValueDepthEffect = document.querySelector('.effect-level__value');

function setEffect (item) {
  previewImgUpload.removeAttribute('class');
  previewImgUpload.setAttribute('class', `img-upload__preview effects__preview--${item}`);
}

function setUpdateSlider (currentItemEffect) {
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
    setEffect(valueItemEffect);
    if (valueItemEffect === 'none') {
      placeSliderTag.classList.add('hidden');
      inputValueDepthEffect.setAttribute('step', '');
      inputValueDepthEffect.setAttribute('value', '');
    } else {
      placeSliderTag.classList.remove('hidden');
      setUpdateSlider(setRenderSliderForCurrentEffect(valueItemEffect));
      setChangeValueDepthEffect(setRenderSliderForCurrentEffect(valueItemEffect));
    }

    placeSlider.noUiSlider.on('update', (__, ___, currentItemSlider) => {
      inputValueDepthEffect.setAttribute('value', `${currentItemSlider}`);
      previewImgUpload.style.filter = setChangeValuesFilterToImgUploadPreview(valueItemEffect, currentItemSlider[0]);
      document.querySelector('.effect__value').textContent = `filter: ${setChangeValuesFilterToImgUploadPreview(valueItemEffect, currentItemSlider[0])}`;
    });

  });
});

// --------------------------------------------------

function setChangeValueDepthEffect (currentEffect) {
  inputValueDepthEffect.setAttribute('step', `${currentEffect.step}`);
}

function setRenderSliderForCurrentEffect (currentEffect) {
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


function setChangeValuesFilterToImgUploadPreview (currentEffect, currentItemSlider) {
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

export {editorUploadPhoto};

/* eslint-disable no-use-before-define */

import {isEscapeKey, VALID_FILE_EXTENSIONS} from './util.js';
import {bodyList} from './render-full-picture.js';
import {regExpList, setTestArrayToFirstHash, setTestArrayToMainRegExp, setTestArrayToASingleCharacterString, setTestArrayToSameHashTags, setDeleteEmptyElement} from './functions-to-module-form.js';
import {setSuccessToUploadPhotos, setErrorToUploadPhotos} from './functions-to-module-api.js';
import {setDataToServer} from './api.js';
import '/nouislider/nouislider.js';

const form = document.querySelector('.img-upload__form');
const fileUploaderButton = document.querySelector('#upload-file');
const currentImageUpload = document.querySelector('.img-upload__preview').querySelector('img');
const editorUploadPhoto = document.querySelector('.img-upload__overlay');
const buttonCloseUploadWindow = document.querySelector('.img-upload__cancel');
const lengthTextComment = document.querySelector('.text-comment__length');
const textComment = document.querySelector('.text__description');
const inputTextHashTags = document.querySelector('.text__hashtags');
const messageToLoading = document.querySelector('#messages').content.querySelector('.img-upload__message');
const textValueScale = document.querySelector('.scale__control--value');
const effectNoneButton = document.querySelector('#effect-none');
const smallerScaleButton = document.querySelector('.scale__control--smaller');
const biggerScaleButton = document.querySelector('.scale__control--bigger');
const previewImgUpload = document.querySelector('.img-upload__preview');
const placeSlider = document.querySelector('.effect-level__slider');
const placeSliderTag = document.querySelector('.img-upload__effect-level');
const effectsRadioList = document.querySelectorAll('.effects__radio');
const inputValueDepthEffect = document.querySelector('.effect-level__value');

const MAX_LENGTH_TEXT_COMMENT_AREA = 140;
const MAX_QUANTITY_HASH_TAGS = 5;
const MIN_ITEM_SCALE = 25;
const MAX_ITEM_SCALE = 100;
const STEP_ITEM_SCALE = 25;


let itemScale = 100;

// Моменты по контролу загрузки фото

function setChangeUploadFile (evt) {
  const files = evt.target.files;
  if (VALID_FILE_EXTENSIONS.some( (item) => files[0].name.includes(item))) {
    currentImageUpload.src = URL.createObjectURL(files[0]);
    setOpenEditorWindow();
  } else {
    fileUploaderButton.setCustomValidity('Неподдерживаемый формат файла\nТолько: .jpeg, .jpg, .png');
    fileUploaderButton.reportValidity();
    fileUploaderButton.value = '';
  }
}

fileUploaderButton.addEventListener('change', setChangeUploadFile);

// -------------------------------------------------------------------
noUiSlider.create(placeSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 80,
  step: 1,
  connect: 'lower',
});

function setEffect (item) {
  previewImgUpload.removeAttribute('class');
  previewImgUpload.setAttribute('class', `img-upload__preview effects__preview--${item}`);
}

function setUpdateSlider (currentItemEffect) {
  placeSlider.noUiSlider.updateOptions(currentItemEffect);
}

//-------------------------------------------------------------

function setCloseUploadWindowEscKeydown (evt) {
  if (isEscapeKey(evt)) {
    setCloseEditorWindow();
  }
}

function setChangeInputFieldToTextComment () {
  const textCommentValue = textComment.value;
  lengthTextComment.textContent = `${textCommentValue.length}/${MAX_LENGTH_TEXT_COMMENT_AREA}`;
}

function setOpenEditorWindow () {
  fileUploaderButton.disabled = true;
  bodyList.classList.add('modal-open');
  editorUploadPhoto.classList.remove('hidden');

  effectsRadioList.forEach( (item) => {
    item.addEventListener('click', () => {
      const valueItemEffect = item.value;
      setEffect(valueItemEffect);

      function setChangeSliderPosition (__, ___, currentItemSlider) {
        const fixedCurrentItem = +currentItemSlider[0].toFixed(1);
        inputValueDepthEffect.setAttribute('value', `${fixedCurrentItem}`);
        previewImgUpload.style.filter = setChangeValuesFilterToImgUploadPreview(valueItemEffect, currentItemSlider[0]);
      }
      if (valueItemEffect === 'none') {
        placeSliderTag.classList.add('hidden');
        inputValueDepthEffect.setAttribute('step', '');
        inputValueDepthEffect.setAttribute('value', '');
      } else {
        placeSliderTag.classList.remove('hidden');
        setUpdateSlider(setRenderSliderForCurrentEffect(valueItemEffect));
        setChangeValueDepthEffect(setRenderSliderForCurrentEffect(valueItemEffect));
      }
      placeSlider.noUiSlider.on('update', setChangeSliderPosition);
    });
  });

  fileUploaderButton.removeEventListener('change', setChangeUploadFile);
  buttonCloseUploadWindow.addEventListener('click', setCloseEditorWindow);
  document.addEventListener('keydown', setCloseUploadWindowEscKeydown);
  textComment.addEventListener ('input', setChangeInputFieldToTextComment);
  inputTextHashTags.addEventListener('input', setChangeInputFieldHashTags);
  smallerScaleButton.addEventListener('click', setClickToSmallerScaleButton);
  biggerScaleButton.addEventListener('click', setClickToBiggerScaleButton);
  form.addEventListener('submit', setSubmitToFormField);
}

function setCloseEditorWindow () {
  fileUploaderButton.disabled = false;
  bodyList.classList.remove('modal-open');
  editorUploadPhoto.classList.add('hidden');
  fileUploaderButton.value = '';
  inputTextHashTags.value = '';
  textComment.value = '';
  lengthTextComment.textContent = `0/${MAX_LENGTH_TEXT_COMMENT_AREA}`;
  placeSliderTag.classList.add('hidden');
  currentImageUpload.src = '';
  currentImageUpload.alt = '';
  previewImgUpload.style.transform = 'scale(1)';
  textValueScale.value = '100%';
  effectNoneButton.click();
  setEffect('none');

  fileUploaderButton.addEventListener('change', setChangeUploadFile);
  buttonCloseUploadWindow.removeEventListener('click', setCloseEditorWindow);
  document.removeEventListener('keydown', setCloseUploadWindowEscKeydown);
  textComment.removeEventListener ('input', setChangeInputFieldToTextComment);
  inputTextHashTags.removeEventListener('input', setChangeInputFieldHashTags);
  smallerScaleButton.removeEventListener('click', setClickToSmallerScaleButton);
  biggerScaleButton.removeEventListener('click', setClickToBiggerScaleButton);
  placeSlider.noUiSlider.off('update');
  form.removeEventListener('submit', setSubmitToFormField);
}

// Моменты по вводу в поле комментария и хештега при загрузке фото


textComment.addEventListener('focus', () => {
  document.removeEventListener('keydown', setCloseUploadWindowEscKeydown);
});

textComment.addEventListener('focusout', () => {
  document.addEventListener('keydown', setCloseUploadWindowEscKeydown);
});

inputTextHashTags.addEventListener('focus', () => {
  document.removeEventListener('keydown', setCloseUploadWindowEscKeydown);
});

inputTextHashTags.addEventListener('focusout', () => {
  document.addEventListener('keydown', setCloseUploadWindowEscKeydown);
});

// Моменты по валидации поля ввода Хештегов

function setValidationCheckForInput (itemsTextHashTags, valueTextHashTags, itemsRegExp) {
  if (itemsTextHashTags.some(setTestArrayToFirstHash)) {
    return 'Хеш-тег должен начинаться с символа # (решётка)';
  }
  if (itemsRegExp.regExpOverOneHash.test(valueTextHashTags) || itemsRegExp.regExpNoSpaceBeforeHash.test(valueTextHashTags)) {
    return 'Между хеш-тегами обязан быть один пробел';
  }
  if (itemsRegExp.regExpOneHash.test(valueTextHashTags)) {
    return 'Хеш-тег не может состоять только из одной решётки (#)';
  }
  if (itemsTextHashTags.length > MAX_QUANTITY_HASH_TAGS) {
    return 'Не более пяти хеш-тегов';
  } else {
    return '';
  }
}

function setValidationCheckForSubmit (itemsTextHashTags) {
  if (itemsTextHashTags.some(setTestArrayToASingleCharacterString)) {
    return 'Хеш-тег не может состоять только из одного символа # (решётка)';
  }
  if (setTestArrayToSameHashTags(itemsTextHashTags)) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }
  if (itemsTextHashTags.some(setTestArrayToMainRegExp)) {
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

function setPopupMessageToLoading () {
  editorUploadPhoto.classList.add('hidden');
  bodyList.appendChild(messageToLoading);
}

function setSubmitToFormField (evt) {
  evt.preventDefault();
  const returnValue = setUniqueOperationsOverInputValueHashTags();
  inputTextHashTags.setCustomValidity(setValidationCheckForSubmit(returnValue[0]));
  if (!inputTextHashTags.validity.valid) {
    inputTextHashTags.classList.add('border-hash-tags');
    inputTextHashTags.reportValidity();
  } else {
    inputTextHashTags.classList.remove('border-hash-tags');
    fileUploaderButton.disabled = false;
    setPopupMessageToLoading();
    setDataToServer(setSuccessToUploadPhotos, setErrorToUploadPhotos);
  }
}

function setChangeInputFieldHashTags () {
  inputTextHashTags.classList.remove('border-hash-tags');
  const returnValue = setUniqueOperationsOverInputValueHashTags();
  inputTextHashTags.setCustomValidity(setValidationCheckForInput(returnValue[0], returnValue[1], regExpList));
  inputTextHashTags.reportValidity();
}


function setStyleTransform () {
  previewImgUpload.style.transform = `scale(${itemScale/100})`;
}

function setChangeTextValueScale () {
  textValueScale.value = `${itemScale}%`;
}

function setClickToSmallerScaleButton () {
  if (itemScale === MIN_ITEM_SCALE) {
    smallerScaleButton.disabled = true;
  } else if (itemScale > MIN_ITEM_SCALE) {
    itemScale -= STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  smallerScaleButton.disabled = false;
  document.querySelector('.scale__control--value').setAttribute('value', `${itemScale}%`);
}

function setClickToBiggerScaleButton () {
  if (itemScale === MAX_ITEM_SCALE) {
    biggerScaleButton.disabled = true;
  } else if (itemScale < MAX_ITEM_SCALE) {
    itemScale += STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  biggerScaleButton.disabled = false;
  document.querySelector('.scale__control--value').setAttribute('value', `${itemScale}%`);
}


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

export {editorUploadPhoto, setOpenEditorWindow, setCloseEditorWindow, fileUploaderButton};

/* eslint-disable no-use-before-define */

import {isEscapeKey, VALID_FILE_EXTENSIONS} from './util.js';
import {bodyContent} from './render-full-picture.js';
import {regExpBlock, setTestArrayToFirstHash, setTestArrayToMainRegExp, setTestArrayToASingleCharacterString, setTestArrayToSameHashTags, setDeleteEmptyElement} from './functions-to-module-form.js';
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
const previewImageUpload = document.querySelector('.img-upload__preview');
const placeSlider = document.querySelector('.effect-level__slider');
const placeSliderTag = document.querySelector('.img-upload__effect-level');
const effectRadioButtons = document.querySelectorAll('.effects__radio');
const inputValueDepthEffect = document.querySelector('.effect-level__value');

const MAX_LENGTH_TEXT_COMMENT_AREA = 140;
const MAX_QUANTITY_HASH_TAGS = 5;
const MIN_ITEM_SCALE = 25;
const MAX_ITEM_SCALE = 100;
const STEP_ITEM_SCALE = 25;


let meaningScale = 100;

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
  previewImageUpload.removeAttribute('class');
  previewImageUpload.setAttribute('class', `img-upload__preview effects__preview--${item}`);
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
  bodyContent.classList.add('modal-open');
  editorUploadPhoto.classList.remove('hidden');

  effectRadioButtons.forEach( (radioButton) => {
    radioButton.addEventListener('click', () => {
      const valueCurrentEffect = radioButton.value;
      setEffect(valueCurrentEffect);

      function setChangeSliderPosition (__, ___, currentMeaningSlider) {
        const fixedCurrentMeaning = +currentMeaningSlider[0].toFixed(1);
        inputValueDepthEffect.setAttribute('value', `${fixedCurrentMeaning}`);
        previewImageUpload.style.filter = setChangeValuesFilterToImgUploadPreview(valueCurrentEffect, currentMeaningSlider[0]);
      }
      if (valueCurrentEffect === 'none') {
        placeSliderTag.classList.add('hidden');
        inputValueDepthEffect.setAttribute('step', '');
        inputValueDepthEffect.setAttribute('value', '');
      } else {
        placeSliderTag.classList.remove('hidden');
        setUpdateSlider(setRenderSliderForCurrentEffect(valueCurrentEffect));
        setChangeValueDepthEffect(setRenderSliderForCurrentEffect(valueCurrentEffect));
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
  bodyContent.classList.remove('modal-open');
  editorUploadPhoto.classList.add('hidden');
  fileUploaderButton.value = '';
  inputTextHashTags.value = '';
  textComment.value = '';
  lengthTextComment.textContent = `0/${MAX_LENGTH_TEXT_COMMENT_AREA}`;
  placeSliderTag.classList.add('hidden');
  currentImageUpload.src = '';
  currentImageUpload.alt = '';
  previewImageUpload.style.transform = 'scale(1)';
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

function setValidationCheckForInput (meaningsTextHashTags, valueTextHashTags, meaningsRegExp) {
  if (meaningsTextHashTags.some(setTestArrayToFirstHash)) {
    return 'Хеш-тег должен начинаться с символа # (решётка)';
  }
  if (meaningsRegExp.regExpOverOneHash.test(valueTextHashTags) || meaningsRegExp.regExpNoSpaceBeforeHash.test(valueTextHashTags)) {
    return 'Между хеш-тегами обязан быть один пробел';
  }
  if (meaningsRegExp.regExpOneHash.test(valueTextHashTags)) {
    return 'Хеш-тег не может состоять только из одной решётки (#)';
  }
  if (meaningsTextHashTags.length > MAX_QUANTITY_HASH_TAGS) {
    return 'Не более пяти хеш-тегов';
  } else {
    return '';
  }
}

function setValidationCheckForSubmit (meaningsTextHashTags) {
  if (meaningsTextHashTags.some(setTestArrayToASingleCharacterString)) {
    return 'Хеш-тег не может состоять только из одного символа # (решётка)';
  }
  if (setTestArrayToSameHashTags(meaningsTextHashTags)) {
    return 'Один и тот же хэш-тег не может быть использован дважды';
  }
  if (meaningsTextHashTags.some(setTestArrayToMainRegExp)) {
    return 'Хеш-тег не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.';
  } else {
    return '';
  }
}

function setUniqueOperationsOverInputValueHashTags () {
  const valueTextHashTags = inputTextHashTags.value.toLowerCase();
  const lineTextHashTags = valueTextHashTags.split(' ');
  const refreshMeaningsTextHashTags = setDeleteEmptyElement(lineTextHashTags);
  return [refreshMeaningsTextHashTags, valueTextHashTags];
}

function setPopupMessageToLoading () {
  editorUploadPhoto.classList.add('hidden');
  bodyContent.appendChild(messageToLoading);
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
  inputTextHashTags.setCustomValidity(setValidationCheckForInput(returnValue[0], returnValue[1], regExpBlock));
  inputTextHashTags.reportValidity();
}


function setStyleTransform () {
  previewImageUpload.style.transform = `scale(${meaningScale/100})`;
}

function setChangeTextValueScale () {
  textValueScale.value = `${meaningScale}%`;
}

function setClickToSmallerScaleButton () {
  if (meaningScale === MIN_ITEM_SCALE) {
    smallerScaleButton.disabled = true;
  } else if (meaningScale > MIN_ITEM_SCALE) {
    meaningScale -= STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  smallerScaleButton.disabled = false;
  document.querySelector('.scale__control--value').setAttribute('value', `${meaningScale}%`);
}

function setClickToBiggerScaleButton () {
  if (meaningScale === MAX_ITEM_SCALE) {
    biggerScaleButton.disabled = true;
  } else if (meaningScale < MAX_ITEM_SCALE) {
    meaningScale += STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  biggerScaleButton.disabled = false;
  document.querySelector('.scale__control--value').setAttribute('value', `${meaningScale}%`);
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

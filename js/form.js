/* eslint-disable no-use-before-define */

import {isEscapeKey, VALID_FILE_EXTENSIONS} from './util.js';
import {bodyContent} from './render-full-picture.js';
import {regExpBlock, setTestArrayToFirstHash, setTestArrayToMainRegExp, setTestArrayToASingleCharacterString, setTestArrayToSameHashTags, setDeleteEmptyElement} from './functions-to-module-form.js';
import {setSuccessToUploadPhotos, setErrorToUploadPhotos} from './functions-to-module-api.js';
import {setDataToServer} from './api.js';
import '/nouislider/nouislider.js';

const MAX_LENGTH_TEXT_COMMENT_AREA = 140;
const MAX_QUANTITY_HASH_TAGS = 5;
const MIN_ITEM_SCALE = 25;
const MAX_ITEM_SCALE = 100;
const STEP_ITEM_SCALE = 25;

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

let meaningScale = 100;

// ?????????????? ???? ???????????????? ???????????????? ????????

const setFieldFileUploadChangeHandler = (evt) => {
  const files = evt.target.files;
  if (VALID_FILE_EXTENSIONS.some( (item) => files[0].name.includes(item))) {
    currentImageUpload.src = URL.createObjectURL(files[0]);
    setOpenEditorWindow();
  } else {
    fileUploaderButton.setCustomValidity('???????????????????????????????? ???????????? ??????????\n????????????: .jpeg, .jpg, .png');
    fileUploaderButton.reportValidity();
    fileUploaderButton.value = '';
  }
};

fileUploaderButton.addEventListener('change', setFieldFileUploadChangeHandler);

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

const setEffect = (item) => {
  previewImageUpload.removeAttribute('class');
  previewImageUpload.setAttribute('class', `img-upload__preview effects__preview--${item}`);
};

const setUpdateSlider = (currentItemEffect) => {
  placeSlider.noUiSlider.updateOptions(currentItemEffect);
};

//-------------------------------------------------------------

const setCloseUploadWindowEscapeKeydownHandler = (evt) => {
  if (isEscapeKey(evt)) {
    setCloseUploadWindowHandler();
  }
};

const setFieldTextCommentInputHandler = () => {
  const textCommentValue = textComment.value;
  lengthTextComment.textContent = `${textCommentValue.length}/${MAX_LENGTH_TEXT_COMMENT_AREA}`;
};

const setOpenEditorWindow = () => {
  fileUploaderButton.disabled = true;
  bodyContent.classList.add('modal-open');
  editorUploadPhoto.classList.remove('hidden');

  effectRadioButtons.forEach( (radioButton) => {
    const setRadioButtonClickHandler = () => {
      const valueCurrentEffect = radioButton.value;
      setEffect(valueCurrentEffect);

      const setSliderPositionChangeHandler = (__, ___, currentMeaningSlider) => {
        const fixedCurrentMeaning = +currentMeaningSlider[0].toFixed(1);
        inputValueDepthEffect.setAttribute('value', `${fixedCurrentMeaning}`);
        previewImageUpload.style.filter = setChangeValuesFilterToImgUploadPreview(valueCurrentEffect, currentMeaningSlider[0]);
      };
      if (valueCurrentEffect === 'none') {
        placeSliderTag.classList.add('hidden');
        inputValueDepthEffect.setAttribute('step', '');
        inputValueDepthEffect.setAttribute('value', '');
      } else {
        placeSliderTag.classList.remove('hidden');
        setUpdateSlider(setRenderSliderForCurrentEffect(valueCurrentEffect));
        setChangeValueDepthEffect(setRenderSliderForCurrentEffect(valueCurrentEffect));
      }
      placeSlider.noUiSlider.on('update', setSliderPositionChangeHandler);
    };

    radioButton.addEventListener('click', setRadioButtonClickHandler);
  });

  fileUploaderButton.removeEventListener('change', setFieldFileUploadChangeHandler);
  buttonCloseUploadWindow.addEventListener('click', setCloseUploadWindowHandler);
  document.addEventListener('keydown', setCloseUploadWindowEscapeKeydownHandler);
  textComment.addEventListener('input', setFieldTextCommentInputHandler);
  inputTextHashTags.addEventListener('input', setFieldHashTagsChangeInputHandler);
  smallerScaleButton.addEventListener('click', setSmallerScaleButtonClickHandler);
  biggerScaleButton.addEventListener('click', setBiggerScaleButtonClickHandler);
  form.addEventListener('submit', setFieldFormSubmitHandler);
};

const setCloseUploadWindowHandler = () => {
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
  textValueScale.setAttribute('value', '100%');
  meaningScale = 100;
  effectNoneButton.click();
  setEffect('none');

  fileUploaderButton.addEventListener('change', setFieldFileUploadChangeHandler);
  buttonCloseUploadWindow.removeEventListener('click', setCloseUploadWindowHandler);
  document.removeEventListener('keydown', setCloseUploadWindowEscapeKeydownHandler);
  textComment.removeEventListener ('input', setFieldTextCommentInputHandler);
  inputTextHashTags.removeEventListener('input', setFieldHashTagsChangeInputHandler);
  smallerScaleButton.removeEventListener('click', setSmallerScaleButtonClickHandler);
  biggerScaleButton.removeEventListener('click', setBiggerScaleButtonClickHandler);
  form.removeEventListener('submit', setFieldFormSubmitHandler);
  placeSlider.noUiSlider.off('update');
};

// ?????????????? ???? ?????????? ?? ???????? ?????????????????????? ?? ?????????????? ?????? ???????????????? ????????


textComment.addEventListener('focus', () => {
  document.removeEventListener('keydown', setCloseUploadWindowEscapeKeydownHandler);
});

textComment.addEventListener('focusout', () => {
  document.addEventListener('keydown', setCloseUploadWindowEscapeKeydownHandler);
});

inputTextHashTags.addEventListener('focus', () => {
  document.removeEventListener('keydown', setCloseUploadWindowEscapeKeydownHandler);
});

inputTextHashTags.addEventListener('focusout', () => {
  document.addEventListener('keydown', setCloseUploadWindowEscapeKeydownHandler);
});

// ?????????????? ???? ?????????????????? ???????? ?????????? ????????????????

const setValidationCheckForInput = (meaningsTextHashTags, valueTextHashTags, meaningsRegExp) => {
  if (meaningsTextHashTags.some(setTestArrayToFirstHash)) {
    return '??????-?????? ???????????? ???????????????????? ?? ?????????????? # (??????????????)';
  }
  if (meaningsRegExp.regExpOverOneHash.test(valueTextHashTags) || meaningsRegExp.regExpNoSpaceBeforeHash.test(valueTextHashTags)) {
    return '?????????? ??????-???????????? ???????????? ???????? ???????? ????????????';
  }
  if (meaningsRegExp.regExpOneHash.test(valueTextHashTags)) {
    return '??????-?????? ???? ?????????? ???????????????? ???????????? ???? ?????????? ?????????????? (#)';
  }
  if (meaningsTextHashTags.length > MAX_QUANTITY_HASH_TAGS) {
    return '???? ?????????? ???????? ??????-??????????';
  }

  return '';
};

const setValidationCheckForSubmit = (meaningsTextHashTags) => {
  if (meaningsTextHashTags.some(setTestArrayToASingleCharacterString)) {
    return '??????-?????? ???? ?????????? ???????????????? ???????????? ???? ???????????? ?????????????? # (??????????????)';
  }
  if (setTestArrayToSameHashTags(meaningsTextHashTags)) {
    return '???????? ?? ?????? ???? ??????-?????? ???? ?????????? ???????? ?????????????????????? ????????????';
  }
  if (meaningsTextHashTags.some(setTestArrayToMainRegExp)) {
    return '??????-?????? ???? ?????????? ?????????????????? ??????????????, ?????????????????????? (#, @, $ ?? ??. ??.), ?????????????? ???????????????????? (????????, ??????????, ?????????????? ?? ??. ??.), ???????????? ?? ??. ??.';
  }

  return '';
};

const setUniqueOperationsOverInputValueHashTags = () => {
  const valueTextHashTags = inputTextHashTags.value.toLowerCase();
  const lineTextHashTags = valueTextHashTags.split(' ');
  const refreshMeaningsTextHashTags = setDeleteEmptyElement(lineTextHashTags);
  return [refreshMeaningsTextHashTags, valueTextHashTags];
};

const setPopupMessageToLoading = () => {
  editorUploadPhoto.classList.add('hidden');
  bodyContent.appendChild(messageToLoading);
};

const setFieldFormSubmitHandler = (evt) => {
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
};

const setFieldHashTagsChangeInputHandler = () => {
  inputTextHashTags.classList.remove('border-hash-tags');
  const returnValue = setUniqueOperationsOverInputValueHashTags();
  inputTextHashTags.setCustomValidity(setValidationCheckForInput(returnValue[0], returnValue[1], regExpBlock));
  inputTextHashTags.reportValidity();
};


const setStyleTransform = () => {
  previewImageUpload.style.transform = `scale(${meaningScale/100})`;
};

const setChangeTextValueScale = () => {
  textValueScale.value = `${meaningScale}%`;
};

const setSmallerScaleButtonClickHandler = () => {
  if (meaningScale === MIN_ITEM_SCALE) {
    smallerScaleButton.disabled = true;
  } else if (meaningScale > MIN_ITEM_SCALE) {
    meaningScale -= STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  smallerScaleButton.disabled = false;
  document.querySelector('.scale__control--value').setAttribute('value', `${meaningScale}%`);
};

const setBiggerScaleButtonClickHandler = () => {
  if (meaningScale === MAX_ITEM_SCALE) {
    biggerScaleButton.disabled = true;
  } else if (meaningScale < MAX_ITEM_SCALE) {
    meaningScale += STEP_ITEM_SCALE;
    setChangeTextValueScale();
    setStyleTransform();
  }
  biggerScaleButton.disabled = false;
  document.querySelector('.scale__control--value').setAttribute('value', `${meaningScale}%`);
};


const setChangeValueDepthEffect = (currentEffect) => {
  inputValueDepthEffect.setAttribute('step', `${currentEffect.step}`);
};

const setRenderSliderForCurrentEffect = (currentEffect) => {
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
};


const setChangeValuesFilterToImgUploadPreview = (currentEffect, currentItemSlider) => {
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
};

export {editorUploadPhoto, setOpenEditorWindow, setCloseUploadWindowHandler, fileUploaderButton};

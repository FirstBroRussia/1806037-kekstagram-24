/* eslint-disable no-use-before-define */
import {isEnterKey, isEscapeKey} from './util.js';

const SET_VALUE_QUANTITY_COMMENTS = 5;

const containerPhotoBlock = document.querySelector('.pictures.container');
const bigPictureWindow = document.querySelector('.big-picture');
const socialCommentCount = document.querySelector('.social__comment-count');
const buttonForUploadComments = document.querySelector('.social__comments-loader');
const bodyContent = document.querySelector('body');
const closeButtonFullPhotoWindow = bigPictureWindow.querySelector('.big-picture__cancel');
const counterLikes = document.querySelector('.likes-count');
const socialCommentsBlockFragment = document.createDocumentFragment();
const socialCommentsBlock = document.querySelector('.social__comments');
const socialCommentBlock = document.querySelector('.social__comment');

let currentVisibleComments = 0;
let currentBlockData;

// ================================================================

const setDataBlockFromServer = function (data) {
  currentBlockData = data;
};


containerPhotoBlock.addEventListener('click', setPhotoMiniaturesClickHandler);
containerPhotoBlock.addEventListener('keydown', setPhotoMiniaturesEnterKeydownHandler);

function setPhotoMiniaturesClickHandler (evt) {
  const currentPhoto = evt.target.closest('a[class="picture"]');
  if (!currentPhoto) {
    return;
  }
  setRenderBigPicture(currentPhoto);
  setRenderCommentsList(currentPhoto, currentBlockData);
  setRenderShowCommentsList();
  setOpenBigPicture();
}

function setPhotoMiniaturesEnterKeydownHandler (evt) {
  if (!isEnterKey(evt)) {
    return;
  }
  const currentPhoto = evt.target.closest('a[class="picture"]');
  if (!currentPhoto) {
    return;
  }
  setRenderBigPicture(currentPhoto);
  setRenderCommentsList(currentPhoto, currentBlockData);
  setRenderShowCommentsList();
  setOpenBigPicture();
}


const setClosePopupWithBigPictureEscapeKeydownHandler = (evt) => {
  if (isEscapeKey(evt)) {
    setClosePopupBigPictureHandler();
  }
};

const setOpenBigPicture = () => {
  bodyContent.classList.add('modal-open');
  bigPictureWindow.classList.remove('hidden');

  containerPhotoBlock.removeEventListener('click', setPhotoMiniaturesClickHandler);
  document.addEventListener ('keydown', setClosePopupWithBigPictureEscapeKeydownHandler);
  closeButtonFullPhotoWindow.addEventListener('click', setClosePopupBigPictureHandler);
  buttonForUploadComments.addEventListener('click', setButtonForRenderCommentsBlockClickHandler);
  containerPhotoBlock.removeEventListener('keydown', setPhotoMiniaturesEnterKeydownHandler);
};

const setClosePopupBigPictureHandler = () => {
  socialCommentsBlock.textContent = '';
  socialCommentCount.textContent = '';
  counterLikes.textContent = '';
  buttonForUploadComments.classList.remove('hidden');
  bodyContent.classList.remove('modal-open');
  bigPictureWindow.classList.add('hidden');

  containerPhotoBlock.addEventListener('click', setPhotoMiniaturesClickHandler);
  document.removeEventListener ('keydown', setClosePopupWithBigPictureEscapeKeydownHandler);
  closeButtonFullPhotoWindow.removeEventListener('click', setClosePopupBigPictureHandler);
  buttonForUploadComments.removeEventListener('click', setButtonForRenderCommentsBlockClickHandler);
  containerPhotoBlock.addEventListener('keydown', setPhotoMiniaturesEnterKeydownHandler);
};


// =========================================================================

const setQuantitySocialCommentsForClickedPhoto = () => {
  const allSocialComments = document.querySelectorAll('.social__comment');
  return allSocialComments;
};

const setSocialCommentCountTextContent = (currentsVisibleComments, allSocialComments) => {
  socialCommentCount.textContent = `${currentsVisibleComments} из ${allSocialComments.length} комментариев`;
};

const setRenderShowCommentsList = () => {
  if (setQuantitySocialCommentsForClickedPhoto().length > SET_VALUE_QUANTITY_COMMENTS) {
    buttonForUploadComments.classList.remove('hidden');
    currentVisibleComments = SET_VALUE_QUANTITY_COMMENTS;
    setSocialCommentCountTextContent(currentVisibleComments, setQuantitySocialCommentsForClickedPhoto());
    setQuantitySocialCommentsForClickedPhoto().forEach( (meaning, index) => {
      if (index >= SET_VALUE_QUANTITY_COMMENTS) {
        meaning.classList.add('hidden');
      }
    });
  } else if (setQuantitySocialCommentsForClickedPhoto().length <= SET_VALUE_QUANTITY_COMMENTS) {
    buttonForUploadComments.classList.add('hidden');
    currentVisibleComments = setQuantitySocialCommentsForClickedPhoto().length;
    setSocialCommentCountTextContent(currentVisibleComments, setQuantitySocialCommentsForClickedPhoto());
  }
};

const setButtonForRenderCommentsBlockClickHandler = () => {
  const specificClassFromListComments = document.querySelectorAll('.social__comment.hidden');
  specificClassFromListComments.forEach( (meaning, index) => {
    if (index < SET_VALUE_QUANTITY_COMMENTS) {
      meaning.classList.remove('hidden');
    }
  });
  const refreshListComments = document.querySelectorAll('.social__comment.hidden');
  if (refreshListComments.length === 0) {
    buttonForUploadComments.classList.add('hidden');
    currentVisibleComments = setQuantitySocialCommentsForClickedPhoto().length;
    setSocialCommentCountTextContent(currentVisibleComments, setQuantitySocialCommentsForClickedPhoto());
  } else {
    currentVisibleComments += SET_VALUE_QUANTITY_COMMENTS;
    setSocialCommentCountTextContent(currentVisibleComments, setQuantitySocialCommentsForClickedPhoto());
  }
};

// +=====================================================================================================

const setRenderBigPicture = (currentClickedPhoto) => {
  const bigPicture = document.querySelector('.big-picture__img');
  const pictureDescription = document.querySelector('.social__caption');
  bigPicture.querySelector('img').src = currentClickedPhoto.querySelector('.picture__img').src;
  bigPicture.querySelector('img').alt = currentClickedPhoto.querySelector('.picture__img').alt;
  counterLikes.textContent = currentClickedPhoto.querySelector('.picture__likes').textContent;
  pictureDescription.textContent = currentClickedPhoto.description;
};

const setRenderCommentsList = (currentUrl, dataBlock) => {
  dataBlock.forEach( (meaning) => {
    const currentClickedPhoto = currentUrl.querySelector('.picture__img').src;
    const currentMeaningUrl = meaning.url;
    if (currentClickedPhoto.includes(currentMeaningUrl)) {
      const comments = meaning.comments;
      comments.forEach( (meaningComments) => {
        const templateSocialComment = socialCommentBlock.cloneNode(true);
        templateSocialComment.querySelector('.social__picture').setAttribute('src', meaningComments.avatar);
        templateSocialComment.querySelector('.social__picture').setAttribute('alt', meaningComments.name);
        templateSocialComment.querySelector('.social__text').textContent = meaningComments.message;
        socialCommentsBlockFragment.appendChild(templateSocialComment);
      });
    }
  });
  socialCommentsBlock.textContent = '';
  socialCommentsBlock.appendChild(socialCommentsBlockFragment);
};


export {bodyContent, setDataBlockFromServer};

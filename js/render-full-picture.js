/* eslint-disable no-use-before-define */
import {isEnterKey, isEscapeKey} from './util.js';

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

const SET_VALUE_QUANTITY_COMMENTS = 5;

let currentVisibleComments = 0;
let currentBlockData;
// ================================================================

const setDataBlockFromServer = function (data) {
  currentBlockData = data;
};


containerPhotoBlock.addEventListener('click', setClickToPhotoMiniatures);
containerPhotoBlock.addEventListener('keydown', setSelectElement);

function setClickToPhotoMiniatures (evt) {
  const currentPhoto = evt.target.closest('a[class="picture"]');
  if (!currentPhoto) {
    return;
  }
  setRenderBigPicture(currentPhoto);
  setRenderCommentsList(currentPhoto, currentBlockData);
  setRenderShowCommentsList();
  setOpenBigPicture();
}

function setSelectElement (evt) {
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


function setClosePopupEscapeKeydown(evt) {
  if (isEscapeKey(evt)) {
    setCloseBigPicture();
  }
}

function setOpenBigPicture () {
  bodyContent.classList.add('modal-open');
  bigPictureWindow.classList.remove('hidden');

  document.addEventListener ('keydown', setClosePopupEscapeKeydown);
  closeButtonFullPhotoWindow.addEventListener('click', setCloseBigPicture);
  buttonForUploadComments.addEventListener('click', setRenderButtonForUploadComments);
  containerPhotoBlock.removeEventListener('keydown', setSelectElement);
}

function setCloseBigPicture () {
  socialCommentsBlock.textContent = '';
  socialCommentCount.textContent = '';
  counterLikes.textContent = '';
  buttonForUploadComments.classList.remove('hidden');
  bodyContent.classList.remove('modal-open');
  bigPictureWindow.classList.add('hidden');

  document.removeEventListener ('keydown', setClosePopupEscapeKeydown);
  closeButtonFullPhotoWindow.removeEventListener('click', setCloseBigPicture);
  buttonForUploadComments.removeEventListener('click', setRenderButtonForUploadComments);
  containerPhotoBlock.addEventListener('keydown', setSelectElement);
}


// =========================================================================

function setQuantitySocialCommentsForClickedPhoto () {
  const allSocialComments = document.querySelectorAll('.social__comment');
  return allSocialComments;
}

function setSocialCommentCountTextContent (currentsVisibleComments, allSocialComments) {
  socialCommentCount.textContent = `${currentsVisibleComments} из ${allSocialComments.length} комментариев`;
}

function setRenderShowCommentsList () {
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
}

function setRenderButtonForUploadComments () {
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
}

// +=====================================================================================================

function setRenderBigPicture (currentClickedPhoto) {
  const bigPicture = document.querySelector('.big-picture__img');
  const pictureDescription = document.querySelector('.social__caption');
  bigPicture.querySelector('img').src = currentClickedPhoto.querySelector('.picture__img').src;
  bigPicture.querySelector('img').alt = currentClickedPhoto.querySelector('.picture__img').alt;
  counterLikes.textContent = currentClickedPhoto.querySelector('.picture__likes').textContent;
  pictureDescription.textContent = currentClickedPhoto.description;
}

function setRenderCommentsList (currentUrl, dataBlock) {
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
}


export {bodyContent, setDataBlockFromServer};

/* eslint-disable no-use-before-define */

import {picturesList} from './render-photo-miniatures.js';
import {isEnterKey, isEscapeKey} from './util.js';

let currentVisibleComments = 0;

const bigPictureWindow = document.querySelector('.big-picture');
const socialCommentCount = document.querySelector('.social__comment-count');
const buttonForUploadingComments = document.querySelector('.social__comments-loader');
const bodyList = document.querySelector('body');
const closeButtonFullPhotoWindow = bigPictureWindow.querySelector('.big-picture__cancel');
const counterLikes = document.querySelector('.likes-count');

const socialCommentsListFragment = document.createDocumentFragment();


const socialCommentsList = document.querySelector('.social__comments');
const blockSocialComment = document.querySelector('.social__comment');

const SET_VALUE_QUANTITY_COMMENTS = 5;
// ================================================================

function closePopupEscapeKeydown(evt) {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
}

function openBigPicture () {
  bodyList.classList.add('modal-open');
  bigPictureWindow.classList.remove('hidden');
  document.addEventListener ('keydown', closePopupEscapeKeydown);
  closeButtonFullPhotoWindow.addEventListener('click', closeBigPicture);
  buttonForUploadingComments.addEventListener('click', setRenderButtonForUploadComments);
}

function closeBigPicture () {
  socialCommentsList.textContent = '';
  socialCommentCount.textContent = '';
  counterLikes.textContent = '';
  buttonForUploadingComments.classList.remove('hidden');
  bodyList.classList.remove('modal-open');
  bigPictureWindow.classList.add('hidden');
  document.removeEventListener ('keydown', closePopupEscapeKeydown);
  closeButtonFullPhotoWindow.removeEventListener('click', closeBigPicture);
  buttonForUploadingComments.removeEventListener('click', setRenderButtonForUploadComments);
}


// =========================================================================

function quantitySocialCommentsForClickedPhoto () {
  const allSocialComments = document.querySelectorAll('.social__comment');
  return allSocialComments;
}

function socialCommentCountTextContent (currentsVisibleComments, allSocialComments) {
  socialCommentCount.textContent = `${currentsVisibleComments} из ${allSocialComments.length} комментариев`;
}

function setRenderShowCommentsList () {
  if (quantitySocialCommentsForClickedPhoto().length > SET_VALUE_QUANTITY_COMMENTS) {
    buttonForUploadingComments.classList.remove('hidden');
    currentVisibleComments = SET_VALUE_QUANTITY_COMMENTS;
    socialCommentCountTextContent(currentVisibleComments, quantitySocialCommentsForClickedPhoto());
    quantitySocialCommentsForClickedPhoto().forEach( (item, index) => {
      if (index >= SET_VALUE_QUANTITY_COMMENTS) {
        item.classList.add('hidden');
      }
    });
  } else if (quantitySocialCommentsForClickedPhoto().length <= SET_VALUE_QUANTITY_COMMENTS) {
    buttonForUploadingComments.classList.add('hidden');
    currentVisibleComments = quantitySocialCommentsForClickedPhoto().length;
    socialCommentCountTextContent(currentVisibleComments, quantitySocialCommentsForClickedPhoto());
  }
}

function setRenderButtonForUploadComments () {
  const specificClassFromListComments = document.querySelectorAll('.social__comment.hidden');
  specificClassFromListComments.forEach( (item, index) => {
    if (index < SET_VALUE_QUANTITY_COMMENTS) {
      item.classList.remove('hidden');
    }
  });
  const refreshListComments = document.querySelectorAll('.social__comment.hidden');
  if (refreshListComments.length === 0) {
    buttonForUploadingComments.classList.add('hidden');
    currentVisibleComments = quantitySocialCommentsForClickedPhoto().length;
    socialCommentCountTextContent(currentVisibleComments, quantitySocialCommentsForClickedPhoto());
  } else {
    currentVisibleComments += SET_VALUE_QUANTITY_COMMENTS;
    socialCommentCountTextContent(currentVisibleComments, quantitySocialCommentsForClickedPhoto());
  }
}

// =====================================================================================================

function setRenderBigPicture (currentClickedPhoto) {
  const bigPicture = document.querySelector('.big-picture__img');
  const pictureDescription = document.querySelector('.social__caption');
  bigPicture.querySelector('img').src = currentClickedPhoto.querySelector('.picture__img').src;
  bigPicture.querySelector('img').alt = currentClickedPhoto.querySelector('.picture__img').alt;
  counterLikes.textContent = currentClickedPhoto.querySelector('.picture__likes').textContent;
  pictureDescription.textContent = currentClickedPhoto.description;
}

function setRenderCommentsList (currentUrl, data) {
  data.forEach( (item) => {
    const currentClickedPhoto = currentUrl.querySelector('.picture__img').src;
    const currentItemUrl = item.url;
    if (currentClickedPhoto.includes(currentItemUrl)) {
      const comments = item.comments;
      comments.forEach( (itemComments) => {
        const templateSocialComment = blockSocialComment.cloneNode(true);
        templateSocialComment.querySelector('.social__picture').src = itemComments.avatar;
        templateSocialComment.querySelector('.social__picture').alt = itemComments.name;
        templateSocialComment.querySelector('.social__text').textContent = itemComments.message;
        socialCommentsListFragment.appendChild(templateSocialComment);
      });
    }
  });
  socialCommentsList.textContent = '';
  socialCommentsList.appendChild(socialCommentsListFragment);
}

function setRenderBigPictureOverlay (data) {

  picturesList.addEventListener('click', (evt) => {
    const currentPhoto = evt.target.closest('a[class="picture"]');
    if (currentPhoto) {
      setRenderBigPicture(currentPhoto, data);
      setRenderCommentsList(currentPhoto, data);
      setRenderShowCommentsList();
      openBigPicture();
    }
  });


  picturesList.addEventListener('keydown', (evt) => {
    if (isEnterKey(evt)) {
      const currentPhoto = evt.target.closest('a[class="picture"]');
      if (currentPhoto) {
        setRenderBigPicture(currentPhoto, data);
        setRenderCommentsList(currentPhoto, data);
        setRenderShowCommentsList();
        openBigPicture();
      }
    }
  });

}

export {bodyList, setRenderBigPictureOverlay};

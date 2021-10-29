/* eslint-disable no-use-before-define */

import {createNewPhotos} from './data.js';
import {picturesList} from './photo-module.js';
import {isEnterKey, isEscapeKey} from './util.js';

let currentVisibleComments = 0;

const bigPictureWindow = document.querySelector('.big-picture');
const socialCommentCount = document.querySelector('.social__comment-count');
const buttonForUploadingComments = document.querySelector('.social__comments-loader');
const bodyList = document.querySelector('body');
const closeButtonFullPhotoWindow = bigPictureWindow.querySelector('.big-picture__cancel');

const socialCommentsListFragment = document.createDocumentFragment();


const socialCommentsList = document.querySelector('.social__comments');
const blockSocialComment = document.querySelector('.social__comment');

function closeBigPicture () {
  buttonForUploadingComments.classList.remove('hidden');
  bodyList.classList.remove('modal-open');
  bigPictureWindow.classList.add('hidden');
  document.removeEventListener ('keydown', closePopupEscapeKeydown);
  closeButtonFullPhotoWindow.removeEventListener('click', closeBigPicture);
}

function closePopupEscapeKeydown(evt) {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
}


function renderCommentsList (currentUrl) {
  createNewPhotos.forEach( (item) => {
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

function renderFullPhoto (currentClickedPhoto) {
  const bigPicture = document.querySelector('.big-picture__img');
  const counterLikes = document.querySelector('.likes-count');
  const pictureDescription = document.querySelector('.social__caption');

  bigPicture.querySelector('img').src = currentClickedPhoto.querySelector('.picture__img').src;
  bigPicture.querySelector('img').alt = currentClickedPhoto.querySelector('.picture__img').alt;
  counterLikes.textContent = currentClickedPhoto.querySelector('.picture__likes').textContent;
  pictureDescription.textContent = currentClickedPhoto.description;
  renderCommentsList(currentClickedPhoto);
}

function openBigPicture () {
  bodyList.classList.add('modal-open');
  bigPictureWindow.classList.remove('hidden');
  document.addEventListener ('keydown', closePopupEscapeKeydown);
  closeButtonFullPhotoWindow.addEventListener('click', closeBigPicture);
}

function allSocialCommentsForClickedPhoto () {
  const allSocialComments = document.querySelectorAll('.social__comment');
  return allSocialComments;
}

function socialCommentCountTextContent (currentsVisibleComments, allSocialComments) {
  socialCommentCount.textContent = `${currentsVisibleComments} из ${allSocialComments.length} комментариев`;
}

function renderShowCommentsList () {
  if (allSocialCommentsForClickedPhoto().length > 5) {
    buttonForUploadingComments.classList.remove('hidden');
    currentVisibleComments = 5;
    socialCommentCountTextContent(currentVisibleComments, allSocialCommentsForClickedPhoto());
    allSocialCommentsForClickedPhoto().forEach( (item, index) => {
      if (index >= 5) {
        item.classList.add('hidden');
      }
    });
  } else if (allSocialCommentsForClickedPhoto().length <= 5) {
    buttonForUploadingComments.classList.add('hidden');
    currentVisibleComments = allSocialCommentsForClickedPhoto().length;
    socialCommentCountTextContent(currentVisibleComments, allSocialCommentsForClickedPhoto());
  }
}

buttonForUploadingComments.addEventListener('click', () => {
  const specificClassFromListComments = document.querySelectorAll('.social__comment.hidden');
  specificClassFromListComments.forEach( (item, index) => {
    if (index < 5) {
      item.classList.remove('hidden');
    }
  });
  const refreshListComments = document.querySelectorAll('.social__comment.hidden');
  if (refreshListComments.length === 0) {
    buttonForUploadingComments.classList.add('hidden');
    currentVisibleComments = allSocialCommentsForClickedPhoto().length;
    socialCommentCountTextContent(currentVisibleComments, allSocialCommentsForClickedPhoto());
  } else {
    currentVisibleComments += 5;
    socialCommentCountTextContent(currentVisibleComments, allSocialCommentsForClickedPhoto());
  }
});


picturesList.addEventListener('click', (evt) => {
  const currentPhoto = evt.target.closest('a[class="picture"]');
  if (currentPhoto) {
    renderFullPhoto(currentPhoto);
    openBigPicture();
    renderShowCommentsList();
  }
});

picturesList.addEventListener('keydown', (evt) => {
  if (isEnterKey(evt)) {
    const currentPhoto = evt.target.closest('a[class="picture"]');
    if (currentPhoto) {
      renderFullPhoto(currentPhoto);
      openBigPicture();
    }
  }
});

export {bodyList};

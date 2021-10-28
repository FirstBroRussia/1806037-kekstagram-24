/* eslint-disable no-use-before-define */

import {createNewPhotos} from './data.js';
import {picturesList} from './photo-module.js';
import {isEnterKey, isEscapeKey} from './util.js';

const bigPictureWindow = document.querySelector('.big-picture');
const counterComments = document.querySelector('.social__comment-count');
const loaderComments = document.querySelector('.comments-loader');
const bodyList = document.querySelector('body');
const closeButtonFullPhotoWindow = bigPictureWindow.querySelector('.big-picture__cancel');

const socialCommentsListFragment = document.createDocumentFragment();

const socialCommentsList = document.querySelector('.social__comments');
const blockSocialComment = document.querySelector('.social__comment');


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

function renderFullPhoto (item) {
  const bigPicture = document.querySelector('.big-picture__img');
  const counterLikes = document.querySelector('.likes-count');
  const pictureCounterComment = document.querySelector('.comments-count');
  const pictureDescription = document.querySelector('.social__caption');

  bigPicture.querySelector('img').src = item.querySelector('.picture__img').src;
  bigPicture.querySelector('img').alt = item.querySelector('.picture__img').alt;
  counterLikes.textContent = item.querySelector('.picture__likes').textContent;
  pictureCounterComment.textContent = item.querySelector('.picture__comments').textContent;
  pictureDescription.textContent = item.description;
  renderCommentsList(item);
}


const closePopupEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
};

function closeBigPicture () {
  counterComments.classList.remove('hidden');
  loaderComments.classList.remove('hidden');
  bodyList.classList.remove('modal-open');
  bigPictureWindow.classList.add('hidden');
  document.removeEventListener ('keydown', closePopupEscapeKeydown);
  closeButtonFullPhotoWindow.removeEventListener('click', closeBigPicture);
}

function openBigPicture () {
  counterComments.classList.add('hidden');
  loaderComments.classList.add('hidden');
  bodyList.classList.add('modal-open');
  bigPictureWindow.classList.remove('hidden');
  document.addEventListener ('keydown', closePopupEscapeKeydown);
  closeButtonFullPhotoWindow.addEventListener('click', closeBigPicture);
}


picturesList.addEventListener('click', (evt) => {
  const currentPhoto = evt.target.closest('a[class="picture"]');
  if (currentPhoto) {
    renderFullPhoto(currentPhoto);
    openBigPicture();
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

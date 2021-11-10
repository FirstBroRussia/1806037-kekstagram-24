/* eslint-disable no-use-before-define */
import {isEnterKey, isEscapeKey} from './util.js';

let currentVisibleComments = 0;
let currentDataList;

const containerPhotoList = document.querySelector('.pictures.container');
const bigPictureWindow = document.querySelector('.big-picture');
const socialCommentCount = document.querySelector('.social__comment-count');
const buttonForUploadComments = document.querySelector('.social__comments-loader');
const bodyList = document.querySelector('body');
const closeButtonFullPhotoWindow = bigPictureWindow.querySelector('.big-picture__cancel');
const counterLikes = document.querySelector('.likes-count');
const socialCommentsListFragment = document.createDocumentFragment();
const socialCommentsList = document.querySelector('.social__comments');
const blockSocialComment = document.querySelector('.social__comment');

const SET_VALUE_QUANTITY_COMMENTS = 5;
// ================================================================

const setDataListFromServer = function (data) {
  currentDataList = data;
};


containerPhotoList.addEventListener('click', setClickToPhotoMiniatures);
containerPhotoList.addEventListener('keydown', setSelectElement);

function setClickToPhotoMiniatures (evt) {
  const currentPhoto = evt.target.closest('a[class="picture"]');
  if (!currentPhoto) {
    return;
  }
  setRenderBigPicture(currentPhoto);
  setRenderCommentsList(currentPhoto, currentDataList);
  setRenderShowCommentsList();
  setOpenBigPicture();
}

function setSelectElement (evt) {
  if (isEnterKey(evt)) {
    const currentPhoto = evt.target.closest('a[class="picture"]');
    if (!currentPhoto) {
      return;
    }
    setRenderBigPicture(currentPhoto);
    setRenderCommentsList(currentPhoto, currentDataList);
    setRenderShowCommentsList();
    setOpenBigPicture();
  }
}


function setClosePopupEscapeKeydown(evt) {
  if (isEscapeKey(evt)) {
    setCloseBigPicture();
  }
}

function setOpenBigPicture () {
  bodyList.classList.add('modal-open');
  bigPictureWindow.classList.remove('hidden');

  document.addEventListener ('keydown', setClosePopupEscapeKeydown);
  closeButtonFullPhotoWindow.addEventListener('click', setCloseBigPicture);
  buttonForUploadComments.addEventListener('click', setRenderButtonForUploadComments);
  containerPhotoList.removeEventListener('keydown', setSelectElement);
}

function setCloseBigPicture () {
  socialCommentsList.textContent = '';
  socialCommentCount.textContent = '';
  counterLikes.textContent = '';
  buttonForUploadComments.classList.remove('hidden');
  bodyList.classList.remove('modal-open');
  bigPictureWindow.classList.add('hidden');

  document.removeEventListener ('keydown', setClosePopupEscapeKeydown);
  closeButtonFullPhotoWindow.removeEventListener('click', setCloseBigPicture);
  buttonForUploadComments.removeEventListener('click', setRenderButtonForUploadComments);
  containerPhotoList.addEventListener('keydown', setSelectElement);
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
    setQuantitySocialCommentsForClickedPhoto().forEach( (item, index) => {
      if (index >= SET_VALUE_QUANTITY_COMMENTS) {
        item.classList.add('hidden');
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
  specificClassFromListComments.forEach( (item, index) => {
    if (index < SET_VALUE_QUANTITY_COMMENTS) {
      item.classList.remove('hidden');
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

function setRenderCommentsList (currentUrl, dataList) {
  dataList.forEach( (item) => {
    const currentClickedPhoto = currentUrl.querySelector('.picture__img').src;
    const currentItemUrl = item.url;
    if (currentClickedPhoto.includes(currentItemUrl)) {
      const comments = item.comments;
      comments.forEach( (itemComments) => {
        const templateSocialComment = blockSocialComment.cloneNode(true);
        templateSocialComment.querySelector('.social__picture').setAttribute('src', itemComments.avatar);
        templateSocialComment.querySelector('.social__picture').setAttribute('alt', itemComments.name);
        templateSocialComment.querySelector('.social__text').textContent = itemComments.message;
        socialCommentsListFragment.appendChild(templateSocialComment);
      });
    }
  });
  socialCommentsList.textContent = '';
  socialCommentsList.appendChild(socialCommentsListFragment);
}


export {bodyList, setDataListFromServer};

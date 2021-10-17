import {createNewPhotos} from './data.js';
import {picturesList} from './photo-module.js';

const photoList = picturesList.querySelectorAll('.picture');

const socialCommentsListFragment = document.createDocumentFragment();
// const currentCommentsListFragment = document.createDocumentFragment();

const socialCommentsList = document.querySelector('.social__comments');
const blockSocialComment = document.querySelector('.social__comment');


function renderCommentsList (currentUrl) {
  createNewPhotos.forEach( (item) => {
    const currentClickPhoto = currentUrl.querySelector('.picture__img').src;
    const currentItemUrl = item.url;
    if (currentClickPhoto.includes(currentItemUrl)) {
      const commentsData = item.comments;
      commentsData.forEach( (itemComments) => {
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

photoList.forEach( (item) => {
  item.addEventListener('click', () => {
    const bigPicture = document.querySelector('.big-picture__img');
    const counterLikes = document.querySelector('.likes-count');
    const picCounterComment = document.querySelector('.comments-count');
    const picDescription = document.querySelector('.social__caption');

    bigPicture.querySelector('img').src = item.querySelector('.picture__img').src;
    counterLikes.textContent = item.querySelector('.picture__likes').textContent;
    picCounterComment.textContent = item.querySelector('.picture__comments').textContent;
    picDescription.textContent = item.description;
    renderCommentsList(item);

    const counterComments = document.querySelector('.social__comment-count');
    const loaderComments = document.querySelector('.comments-loader');
    const bodyList = document.querySelector('body');
    counterComments.classList.add('hidden');
    loaderComments.classList.add('hidden');
    bodyList.classList.add('modal-open');

    const bigPictureWindow = document.querySelector('.big-picture');
    bigPictureWindow.classList.remove('hidden');

  });
});

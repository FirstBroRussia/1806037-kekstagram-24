import {createNewPhotos} from './data.js';

const template = document.querySelector('#picture').content.querySelector('a');
const picturesFragment = document.createDocumentFragment();

const newPhotosData = createNewPhotos;

newPhotosData.forEach( (itemObject) => {
  const photoUser = document.createElement('div');
  const templateClone = template.cloneNode(true);
  templateClone.querySelector('.picture__img').src = itemObject.url;
  templateClone.querySelector('.picture__comments').textContent = itemObject.comments.message;
  templateClone.querySelector('.picture__likes').textContent = itemObject.likes;
  photoUser.appendChild(templateClone);
  picturesFragment.appendChild(photoUser);
});

export {picturesFragment};

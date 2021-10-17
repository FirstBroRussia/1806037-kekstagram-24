import {createNewPhotos} from './data.js';

const picturesList = document.querySelector('.pictures');
const template = document.querySelector('#picture').content.querySelector('a');
const picturesFragment = document.createDocumentFragment();

createNewPhotos.forEach( (itemObject) => {
  const photoUser = document.createElement('div');
  const templateClone = template.cloneNode(true);
  templateClone.querySelector('.picture__img').src = itemObject.url;
  templateClone.querySelector('.picture__comments').textContent = itemObject.comments.length;
  templateClone.querySelector('.picture__likes').textContent = itemObject.likes;
  photoUser.appendChild(templateClone);
  picturesFragment.appendChild(photoUser);
});

picturesList.appendChild(picturesFragment);

export {picturesList};

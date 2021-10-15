import {createNewPhotos} from './data.js';

const template = document.querySelector('#picture').content.querySelector('a');
const picturesFragment = document.createDocumentFragment();

const generatePhotoBlock = function (photoData) {
  const photoUser = document.createElement('div');
  const templateClone = template.cloneNode(true);
  templateClone.querySelector('.picture__img').src = photoData.url;
  templateClone.querySelector('.picture__comments').textContent = photoData.comments.message;
  templateClone.querySelector('.picture__likes').textContent = photoData.likes;
  photoUser.appendChild(templateClone);
  picturesFragment.appendChild(photoUser);
};

for (let iBasis = 0; iBasis < createNewPhotos.length; iBasis++) {
  generatePhotoBlock(createNewPhotos[iBasis]);
}

export {picturesFragment};

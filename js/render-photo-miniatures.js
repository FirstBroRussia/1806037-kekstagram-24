import {setDataBlockFromServer} from './render-full-picture.js';

const containerPhotoBlock = document.querySelector('.pictures.container');
const template = document.querySelector('#picture').content.querySelector('a');
const picturesFragment = document.createDocumentFragment();


function setRenderPhotoMiniatures (data) {
  data.forEach( (item) => {
    const photoUser = document.createElement('div');
    photoUser.classList.add('photo-from-server');
    const templateClone = template.cloneNode(true);
    templateClone.querySelector('.picture__img').src = item.url;
    templateClone.querySelector('.picture__comments').textContent = item.comments.length;
    templateClone.querySelector('.picture__likes').textContent = item.likes;
    photoUser.appendChild(templateClone);
    picturesFragment.appendChild(photoUser);
  });
  containerPhotoBlock.appendChild(picturesFragment);

  setDataBlockFromServer(data);
}


export {containerPhotoBlock, setRenderPhotoMiniatures};

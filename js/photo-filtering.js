import { containerPhotoList, setRenderPhotoMuniatures } from './render-photo-miniatures.js';
import { randomNumeric } from './util.js';

const blockFilterPhoto = document.querySelector('.img-filters.container');

function setDeleteClassFilterButtonHighLights () {
  const buttonsFilter = document.querySelectorAll('.img-filters__button');
  for (const buttonFilter of buttonsFilter) {
    buttonFilter.classList.remove('img-filters__button--active');
  }
}

function setClearPicturesList () {
  const picturesList = containerPhotoList.querySelectorAll('.photo-from-server');
  for (const picture of picturesList) {
    picture.remove();
  }
}

function setRenderPhotoMiniaturesByRandomFilter (data) {
  const uniqueValues = [];
  while (uniqueValues.length < 25) {
    const randomItem = randomNumeric(0, data.length - 1);
    if (!uniqueValues.includes(randomItem)) {
      uniqueValues.push(randomItem);
    }
  }
  const convertedDataByRandomFilter = data.map( (item, index, items) => {
    item = items[uniqueValues[index]];
    return item;
  })
    .slice(0,10);
  setRenderPhotoMuniatures(convertedDataByRandomFilter);
}

function setRenderPhotoMiniaturesByDiscussedFilter (data) {
  const convertedDataByDiscussionFilter = data.map( (item) => {
    const currentElementObject = item;
    const newElementObject = {commentsListLength: item.comments.length};
    item = Object.assign(currentElementObject, newElementObject);
    return item;
  })
    .sort( (itemA, itemB) => itemB.commentsListLength - itemA.commentsListLength);
  setRenderPhotoMuniatures(convertedDataByDiscussionFilter);
}

function setShowWindowsWithFilters (data) {
  blockFilterPhoto.classList.remove('img-filters--inactive');

  let setTimeOutOperation;

  function setClickToFilterButton (evt) {

    if (evt.target.closest('#filter-default')) {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-default').classList.add('img-filters__button--active');
      clearTimeout(setTimeOutOperation);
      setTimeOutOperation = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMuniatures(data);
      }, 500);
    } else if (evt.target.closest('#filter-random')) {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-random').classList.add('img-filters__button--active');
      clearTimeout(setTimeOutOperation);
      setTimeOutOperation = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMiniaturesByRandomFilter(data);
      }, 500);
    } else if (evt.target.closest('#filter-discussed')) {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-discussed').classList.add('img-filters__button--active');
      clearTimeout(setTimeOutOperation);
      setTimeOutOperation = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMiniaturesByDiscussedFilter(data);
      }, 500);
    }
  }

  blockFilterPhoto.addEventListener('click', setClickToFilterButton);
}


export {setShowWindowsWithFilters};

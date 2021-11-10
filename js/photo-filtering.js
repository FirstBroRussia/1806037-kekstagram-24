import { containerPhotoList, setRenderPhotoMuniatures } from './render-photo-miniatures.js';
import { randomNumeric } from './util.js';

const blockFilterPhoto = document.querySelector('.img-filters.container');

const UNIQUE_VALUES_LENGTH = 10;
const TIME_OUT_TO_DEBOUNCE = 500;

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
  while (uniqueValues.length < UNIQUE_VALUES_LENGTH) {
    const randomItem = randomNumeric(0, data.length - 1);
    if (!uniqueValues.includes(randomItem)) {
      uniqueValues.push(randomItem);
    }
  }
  const convertedDataByRandomFilter = data.map( (item, index, items) => items[uniqueValues[index]])
    .slice(0,10);
  setRenderPhotoMuniatures(convertedDataByRandomFilter);
}

function setRenderPhotoMiniaturesByDiscussedFilter (data) {
  const convertedDataByDiscussionFilter = data.map( (item) =>
    ({
      ...item,
      commentsListLength: item.comments.length,
    }),
  )
    .sort( (itemA, itemB) => itemB.commentsListLength - itemA.commentsListLength);
  setRenderPhotoMuniatures(convertedDataByDiscussionFilter);
}

function setShowWindowsWithFilters (data) {
  blockFilterPhoto.classList.remove('img-filters--inactive');

  let timeout;

  function setClickToFilterButton (evt) {

    function setTargetToFilterDefault () {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-default').classList.add('img-filters__button--active');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMuniatures(data);
      }, TIME_OUT_TO_DEBOUNCE);
    }

    function setClickToFilterRandom () {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-random').classList.add('img-filters__button--active');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMiniaturesByRandomFilter(data);
      }, TIME_OUT_TO_DEBOUNCE);
    }

    function setClickToFilterDiscuss () {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-discussed').classList.add('img-filters__button--active');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMiniaturesByDiscussedFilter(data);
      }, TIME_OUT_TO_DEBOUNCE);
    }

    if (evt.target.closest('#filter-default')) {
      setTargetToFilterDefault();
    } else if (evt.target.closest('#filter-random')) {
      setClickToFilterRandom();
    } else if (evt.target.closest('#filter-discussed')) {
      setClickToFilterDiscuss();
    }
  }

  blockFilterPhoto.addEventListener('click', setClickToFilterButton);
}


export {setShowWindowsWithFilters};

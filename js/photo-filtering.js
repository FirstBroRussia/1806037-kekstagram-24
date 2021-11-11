import {containerPhotoBlock, setRenderPhotoMiniatures} from './render-photo-miniatures.js';
import {randomNumeric} from './util.js';

const blockFilterPhoto = document.querySelector('.img-filters.container');

const QUANTITY_MINIATURES = 10;
const TIME_OUT_TO_DEBOUNCE = 500;

function setDeleteClassFilterButtonHighLights () {
  const buttonsFilter = document.querySelectorAll('.img-filters__button');
  for (const buttonFilter of buttonsFilter) {
    buttonFilter.classList.remove('img-filters__button--active');
  }
}

function setClearPicturesList () {
  const picturesBlock = containerPhotoBlock.querySelectorAll('.photo-from-server');
  for (const picture of picturesBlock) {
    picture.remove();
  }
}

function setRenderPhotoMiniaturesByRandomFilter (data) {
  const uniqueValues = [];
  while (uniqueValues.length < QUANTITY_MINIATURES) {
    const randomMeaning = randomNumeric(0, data.length - 1);
    if (!uniqueValues.includes(randomMeaning)) {
      uniqueValues.push(randomMeaning);
    }
  }
  const convertedDataByRandomFilter = data.map( (meaning, index, meanings) => meanings[uniqueValues[index]])
    .slice(0,QUANTITY_MINIATURES);
  setRenderPhotoMiniatures(convertedDataByRandomFilter);
}

function setRenderPhotoMiniaturesByDiscussedFilter (data) {
  const convertedDataByDiscussionFilter = data.map( (meaning) =>
    ({
      ...meaning,
      commentsListLength: meaning.comments.length,
    }),
  )
    .sort( (meaningA, meaningB) => meaningB.commentsListLength - meaningA.commentsListLength);
  setRenderPhotoMiniatures(convertedDataByDiscussionFilter);
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
        setRenderPhotoMiniatures(data);
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

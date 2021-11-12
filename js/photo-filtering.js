import {containerPhotoBlock, setRenderPhotoMiniatures} from './render-photo-miniatures.js';
import {setRandomNumeric} from './util.js';

const QUANTITY_MINIATURES = 10;
const TIME_OUT_TO_DEBOUNCE = 500;

const blockFilterPhoto = document.querySelector('.img-filters.container');

const setDeleteClassFilterButtonHighLights = () => {
  const buttonsFilter = document.querySelectorAll('.img-filters__button');
  for (const buttonFilter of buttonsFilter) {
    buttonFilter.classList.remove('img-filters__button--active');
  }
};

const setClearPicturesList = () => {
  const picturesBlock = containerPhotoBlock.querySelectorAll('.photo-from-server');
  for (const picture of picturesBlock) {
    picture.remove();
  }
};

const setRenderPhotoMiniaturesByRandomFilter = (data) => {
  const uniqueValues = [];
  while (uniqueValues.length < QUANTITY_MINIATURES) {
    const randomMeaning = setRandomNumeric(0, data.length - 1);
    if (!uniqueValues.includes(randomMeaning)) {
      uniqueValues.push(randomMeaning);
    }
  }
  const convertedDataByRandomFilter = data.map( (meaning, index, meanings) => meanings[uniqueValues[index]])
    .slice(0,QUANTITY_MINIATURES);
  setRenderPhotoMiniatures(convertedDataByRandomFilter);
};

const setRenderPhotoMiniaturesByDiscussedFilter = (data) => {
  const convertedDataByDiscussionFilter = data.map( (meaning) =>
    ({
      ...meaning,
      commentsListLength: meaning.comments.length,
    }),
  )
    .sort( (meaningA, meaningB) => meaningB.commentsListLength - meaningA.commentsListLength);
  setRenderPhotoMiniatures(convertedDataByDiscussionFilter);
};

const setShowWindowsWithFilters = (data) => {
  blockFilterPhoto.classList.remove('img-filters--inactive');

  let timeout;

  const setFilterButtonClickHandler = (evt) => {

    const setTargetToFilterDefault = () => {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-default').classList.add('img-filters__button--active');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMiniatures(data);
      }, TIME_OUT_TO_DEBOUNCE);
    };

    const setClickToFilterRandom = () => {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-random').classList.add('img-filters__button--active');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMiniaturesByRandomFilter(data);
      }, TIME_OUT_TO_DEBOUNCE);
    };

    const setClickToFilterDiscuss = () => {
      setDeleteClassFilterButtonHighLights();
      evt.target.closest('#filter-discussed').classList.add('img-filters__button--active');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setClearPicturesList();
        setRenderPhotoMiniaturesByDiscussedFilter(data);
      }, TIME_OUT_TO_DEBOUNCE);
    };

    if (evt.target.closest('#filter-default')) {
      setTargetToFilterDefault();
    } else if (evt.target.closest('#filter-random')) {
      setClickToFilterRandom();
    } else if (evt.target.closest('#filter-discussed')) {
      setClickToFilterDiscuss();
    }
  };

  blockFilterPhoto.addEventListener('click', setFilterButtonClickHandler);
};


export {setShowWindowsWithFilters};

const VALID_FILE_EXTENSIONS = ['png', 'jpeg', 'jpg'];

const randomNumeric = function randomNumeric(min, max) {
  const minNumeric = Math.min(min, max);
  const maxNumeric = Math.max(min, max);
  const numeric = Math.floor(Math.random() * ((maxNumeric + 1) - minNumeric) + minNumeric);
  return numeric;
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const isEnterKey = (evt) => evt.key === 'Enter';

export {randomNumeric, isEnterKey, isEscapeKey, VALID_FILE_EXTENSIONS};

const randomNumeric = function randomNumeric(min, max) {
  const minNumeric = Math.min(min, max);
  const maxNumeric = Math.max(min, max);
  const numeric = Math.floor(Math.random() * ((maxNumeric + 1) - minNumeric) + minNumeric);
  return numeric;
};


const textLength = function textLength(textValue, defaultLength) {
  return textValue.length <= defaultLength;
};


const isEscapeKey = (evt) => evt.key === 'Escape';

const isEnterKey = (evt) => evt.key === 'Enter';

export {randomNumeric, textLength, isEnterKey, isEscapeKey};

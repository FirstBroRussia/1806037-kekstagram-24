const randomNumeric = function randomNumeric(min, max) {
  const minNumeric = Math.min(min, max);
  const maxNumeric = Math.max(min, max);
  const numeric = Math.floor(Math.random() * ((maxNumeric + 1) - minNumeric) + minNumeric);
  return numeric;
};

randomNumeric(5, 1);

const textLength = function textLength(textValue, defaultLength) {
  return textValue.length <= defaultLength;
};

textLength('ssss', 4);

const randomNumber = function randomNumber(min, max) {
  if (min < 0 || max < 0 || (max - min) <= 0) {
    const textInfo = 'Введенные параметры не соответствуют условиям: min, max >= 0; max > min';
    return textInfo;
  }
  const number = Math.floor(Math.random() * ((max + 1) - min) + min);
  return number;
};

randomNumber(2, 18);

const stringLength = function stringLength(stringValue, defaultLength) {
  if (stringValue.length <= defaultLength) {
    return true;
  }
  return false;
};

stringLength('5455', 4);

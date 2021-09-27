const randomNumber = function (min, max) {
  if (min < 0 || max < 0 || (max - min) <= 0) {
    return "Введенные параметры не соответствуют условиям: min, max >= 0; max > min";
  }
let number = Math.round(Math.random() * ((max + 1) - min) + min);
number > max ? number = max : number ;
return number;
}

console.log(randomNumber(2, 18));

const stringLength = function (stringValue, defaultLength) {
  stringValue = String(stringValue);
if (stringValue.length <= defaultLength) {
  return true;
}
return false;
}

console.log(stringLength(546, 4));


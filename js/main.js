let randomNumber = function (min, max) {
  if (min < 0 || max < 0 || (max - min) <= 0) {
    return "Введенные параметры не соответствуют условиям: min, max >= 0; max > min";
  }
let number = Math.round(Math.random() * ((max + 1) - min) + min);
number > max ? number = Math.floor(number) : number ;
return number;
}

let stringLength = function (stringValue, defaultLength) {
  stringValue = String(stringValue);
if (stringValue.length <= defaultLength) {
  return true;
}
return false;
}


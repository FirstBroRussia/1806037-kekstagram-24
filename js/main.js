cconst randomNumeric = function randomNumeric(min, max) {
  const numeric = Math.floor(Math.random() * ((Math.max(min, max) + 1) - Math.min(min, max)) + Math.min(min, max));
  return numeric;
};

randomNumeric(1, 5);

const valueLength = function valueLength(value, defaultLength) {
  return value.length <= defaultLength;
};

valueLength('ssss', 4);

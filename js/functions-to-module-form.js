const regExpHashTag = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const regExpFirstSymbol = /^#/;
const regExpOverOneSpace = /\s\s/;
const regExpOneHash = /#\s/;
const regExpOverOneHash = /##/;
const regExpNoSpaceBeforeHash = /\S#/;


function testArrayToFirstHash (item) {
  if (!regExpFirstSymbol.test(item) && item.length > 0) {
    return true;
  }
}

function testArrayToMainRegExp (item) {
  if (!regExpHashTag.test(item)) {
    return true;
  }
}

function testArrayToASingleCharacterString (item) {
  if (item === '#') {
    return true;
  }
}

function testArrayToSameHashTags (array) {
  for (let index = 0; index < array.length; index++) {
    const customArray = array.slice(index + 1);
    if (customArray.some( (item) => item === array[index])) {
      return true;
    }
  }
}

function deleteEmptyElement (array) {
  // eslint-disable-next-line no-shadow
  array.forEach( (item, index, array) => {
    if (item === '') {
      delete array[index];
    }
  });
}

/* function testArrayToSameHashTags (item, index, array) {
  array.includes(item);
} */

export { regExpOverOneSpace, regExpOneHash, regExpOverOneHash, regExpNoSpaceBeforeHash, testArrayToFirstHash, testArrayToMainRegExp, testArrayToASingleCharacterString, testArrayToSameHashTags, deleteEmptyElement};

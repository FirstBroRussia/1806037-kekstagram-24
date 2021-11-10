const regExpList = {
  regExpHashTag : /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/,
  regExpFirstSymbol : /^#/,
  regExpOneHash : /#\s/,
  regExpOverOneHash : /##/,
  regExpNoSpaceBeforeHash : /\S#/,
};


function setTestArrayToFirstHash (item) {
  if (!regExpList.regExpFirstSymbol.test(item) && item.length > 0) {
    return true;
  }
}

function setTestArrayToMainRegExp (item) {
  return !regExpList.regExpHashTag.test(item);
}

function setTestArrayToASingleCharacterString (item) {
  if (item === '#') {
    return true;
  }
}

function setTestArrayToSameHashTags (items) {
  for (let index = 0; index < items.length; index++) {
    const customArray = items.slice(index + 1);
    if (customArray.some( (item) => item === items[index])) {
      return true;
    }
  }
}

function setDeleteEmptyElement (items) {
  const refreshItemsTextHashTags = items.filter( (item) => !(item === ''));
  return refreshItemsTextHashTags;
}


export {regExpList, setTestArrayToFirstHash, setTestArrayToMainRegExp, setTestArrayToASingleCharacterString, setTestArrayToSameHashTags, setDeleteEmptyElement};

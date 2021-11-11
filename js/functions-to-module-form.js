const regExpBlock = {
  regExpHashTag : /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/,
  regExpFirstSymbol : /^#/,
  regExpOneHash : /#\s/,
  regExpOverOneHash : /##/,
  regExpNoSpaceBeforeHash : /\S#/,
};


function setTestArrayToFirstHash (meaning) {
  if (!regExpBlock.regExpFirstSymbol.test(meaning) && meaning.length > 0) {
    return true;
  }
}

function setTestArrayToMainRegExp (meaning) {
  return !regExpBlock.regExpHashTag.test(meaning);
}

function setTestArrayToASingleCharacterString (meaning) {
  if (meaning === '#') {
    return true;
  }
}

function setTestArrayToSameHashTags (meanings) {
  for (let index = 0; index < meanings.length; index++) {
    const convertedMeanings = meanings.slice(index + 1);
    if (convertedMeanings.some( (meaning) => meaning === meanings[index])) {
      return true;
    }
  }
}

function setDeleteEmptyElement (meanings) {
  const refreshMeaningsTextHashTags = meanings.filter( (meaning) => !(meaning === ''));
  return refreshMeaningsTextHashTags;
}


export {regExpBlock, setTestArrayToFirstHash, setTestArrayToMainRegExp, setTestArrayToASingleCharacterString, setTestArrayToSameHashTags, setDeleteEmptyElement};

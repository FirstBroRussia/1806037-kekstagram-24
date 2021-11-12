const regExpBlock = {
  regExpHashTag : /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/,
  regExpFirstSymbol : /^#/,
  regExpOneHash : /#\s/,
  regExpOverOneHash : /##/,
  regExpNoSpaceBeforeHash : /\S#/,
};


const setTestArrayToFirstHash = (meaning) => {
  if (!regExpBlock.regExpFirstSymbol.test(meaning) && meaning.length > 0) {
    return true;
  }
}

const setTestArrayToMainRegExp = (meaning) => {
  return !regExpBlock.regExpHashTag.test(meaning);
}

const setTestArrayToASingleCharacterString = (meaning) => {
  if (meaning === '#') {
    return true;
  }
}

const setTestArrayToSameHashTags = (meanings) => {
  for (let index = 0; index < meanings.length; index++) {
    const convertedMeanings = meanings.slice(index + 1);
    if (convertedMeanings.some( (meaning) => meaning === meanings[index])) {
      return true;
    }
  }
}

const setDeleteEmptyElement = (meanings) => {
  const refreshMeaningsTextHashTags = meanings.filter( (meaning) => !(meaning === ''));
  return refreshMeaningsTextHashTags;
}


export {regExpBlock, setTestArrayToFirstHash, setTestArrayToMainRegExp, setTestArrayToASingleCharacterString, setTestArrayToSameHashTags, setDeleteEmptyElement};

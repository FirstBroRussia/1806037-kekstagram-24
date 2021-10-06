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

const listNames = [
  'Александр',
  'Михаил',
  'Дмитрий',
  'Иван',
  'Даниил',
  'Роман',
  'Кирилл',
  'Егор',
  'Матвей',
  'Максим',
  'Анна',
  'Мария',
  'Александра',
  'Виктория',
  'Софья',
  'Алиса',
  'Дарья',
  'Василиса',
  'Елизавета',
  'Арина',
];

const listComments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const arrayNewComment = Array.from({length: 20});
const arrayNewPhoto = Array.from({length: 25});

function createArrayNewComments () {
  for (let counter = 1; counter <= arrayNewComment.length; counter++) {
    arrayNewComment[counter-1] = {
      id: counter,
      avatar: `img/avatar-${randomNumeric(1, 6)}.svg`,
      message: listComments[randomNumeric(0, listComments.length - 1)],
      name: listNames[randomNumeric(0, listNames.length - 1)],
    };
  }
  return arrayNewComment;
}

createArrayNewComments();

function createArrayNewPhotos () {
  for (let counter = 1; counter <= arrayNewPhoto.length; counter++) {
    arrayNewPhoto[counter-1] = {
      id: counter,
      url: `photos/${counter}.jpg`,
      description: '',
      likes: randomNumeric(15, 200),
      comments: arrayNewComment[randomNumeric(0, arrayNewComment.length - 1)],
    };
  }
  return arrayNewPhoto;
}

createArrayNewPhotos();

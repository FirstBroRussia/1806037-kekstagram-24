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

const LIST_NAMES = [
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

const LIST_COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const RANDOM_POSTS_COUNT = 25;

const newComments = Array.from({length: RANDOM_POSTS_COUNT});
const newPhotos = Array.from({length: 25});

const createNewComments = newComments.map( (element, index) => {
  element = {
    id: index + 1,
    avatar: `img/avatar-${randomNumeric(1, 6)}.svg`,
    message: LIST_COMMENTS[randomNumeric(0, LIST_COMMENTS.length - 1)],
    name: LIST_NAMES[randomNumeric(0, LIST_NAMES.length - 1)],
  };
  return element;
});

const createNewPhotos = newPhotos.map( (item, index) => {
  item = {
    id: index + 1,
    url: `photos/${index + 1}.jpg`,
    description: '',
    likes: randomNumeric(15, 200),
    comments: createNewComments[index],
  };
  return item;
});

createNewPhotos;

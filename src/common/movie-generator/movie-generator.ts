import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { MovieGeneratorInterface } from './movie-generator.interface.js';

const MIN_RATING = 0;
const MAX_RATING = 5;

const MIN_DURATION = 45;
const MAX_DURATION = 200;

const MIN_COMMENT_NUMBER = 0;
const MAX_COMMENT_NUMBER = 1000;

const MIN_RELEASE_DATE = 1895;
const MAX_RELEASE_DATE = 2023;

const FIRST_YEAR_DAY = 1;
const LAST_YEAR_DAY = 365;

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_YEAR_DAY, LAST_YEAR_DAY), 'day').toISOString();
    const genre = getRandomItems<string>(this.mockData.genres).join(';');
    const releaseDate = generateRandomValue(MIN_RELEASE_DATE, MAX_RELEASE_DATE).toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const previewVideo = getRandomItem<string>(this.mockData.previewVideos);
    const video = getRandomItem<string>(this.mockData.videos);
    const actor = getRandomItems<string>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.directors);
    const duration = generateRandomValue(MIN_DURATION, MAX_DURATION).toString();
    const commentCount = generateRandomValue(MIN_COMMENT_NUMBER, MAX_COMMENT_NUMBER).toString();
    const user = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const posterImage = getRandomItem<string>(this.mockData.posters);
    const backgroungImage = getRandomItem<string>(this.mockData.backgroungImages);
    const backgroungColor = getRandomItem<string>(this.mockData.backgroungColors);

    return [
      title, description,
      postDate, genre,
      releaseDate, rating,
      previewVideo, video,
      actor, director,
      duration, commentCount,
      user, email,
      avatar, posterImage,
      backgroungImage,
      backgroungColor
    ].join('\t');
  }
}

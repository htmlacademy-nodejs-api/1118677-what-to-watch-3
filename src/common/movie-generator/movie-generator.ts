import dayjs from 'dayjs';
import { GenreType } from '../../types/genre-type.enum.js';
import { MockData } from '../../types/mock-data.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { MovieGeneratorInterface } from './movie-generator.interface.js';

const Rating = {
  Min: 0,
  Max: 5
} as const;

const Duration = {
  Min: 45,
  Max: 200
} as const;

const CommentNumber = {
  Min: 0,
  Max: 1000
} as const;

const ReleaseDate = {
  Min: 1895,
  Max: 2023
} as const;

const YearDay = {
  First: 1,
  Last: 365
} as const;

export default class MovieGenerator implements MovieGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs().subtract(generateRandomValue(YearDay.First, YearDay.Last), 'day').toISOString();
    const genre = getRandomItem<string>(Object.keys(GenreType));
    const releaseDate = generateRandomValue(ReleaseDate.Min, ReleaseDate.Max).toString();
    const rating = generateRandomValue(Rating.Min, Rating.Max).toString();
    const previewVideo = getRandomItem<string>(this.mockData.previewVideos);
    const video = getRandomItem<string>(this.mockData.videos);
    const actor = getRandomItems<string>(this.mockData.actors).join(';');
    const director = getRandomItem<string>(this.mockData.directors);
    const duration = generateRandomValue(Duration.Min, Duration.Max).toString();
    const commentCount = generateRandomValue(CommentNumber.Min, CommentNumber.Max).toString();
    const user = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const posterImage = getRandomItem<string>(this.mockData.posters);
    const backgroundImage = getRandomItem<string>(this.mockData.backgroundImages);
    const backgroundColor = getRandomItem<string>(this.mockData.backgroundColors);

    return [
      title, description,
      postDate, genre,
      releaseDate, rating,
      previewVideo, video,
      actor, director,
      duration, commentCount,
      user, email,
      avatar, posterImage,
      backgroundImage,
      backgroundColor
    ].join('\t');
  }
}

import crypto from 'crypto';
import { Movie } from '../types/movie.type.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, createdDate, genres, releaseDate, rating, previewVideo, video,
    actors, director, duration, commentCount, firstname, email, avatarPath, posterImage,
    backgroungImage, backgroungColor] = tokens;
  return {
    title,
    description,
    postDate: new Date(createdDate).toISOString(),
    genres: genres.split(';').map((name) => ({name})),
    releaseDate,
    rating: Number.parseInt(rating, 10),
    previewVideo,
    video,
    actors: actors.split(';').map((name) => ({name})),
    director,
    duration: Number.parseInt(duration, 10),
    commentCount: Number.parseInt(commentCount, 10),
    user: {firstname, email, avatarPath},
    posterImage,
    backgroungImage,
    backgroungColor
  } as Movie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

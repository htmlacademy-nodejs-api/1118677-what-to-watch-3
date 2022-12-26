import { Movie } from '../types/movie.type.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, createdDate, genres, releaseDate, rating, previewVideo, video,
    actors, director, duration, commentNumber, firstname, email, avatarPath, poster,
    backgroungImage, backgroungColor] = tokens;
  return {
    title,
    description,
    postDate: new Date(createdDate),
    genres: genres.split(';').map((name) => ({name})),
    releaseDate,
    rating: Number.parseInt(rating, 10),
    previewVideo,
    video,
    actors: actors.split(';').map((name) => ({name})),
    director,
    duration: Number.parseInt(duration, 10),
    commentNumber: Number.parseInt(commentNumber, 10),
    user: {firstname, email, avatarPath},
    poster,
    backgroungImage,
    backgroungColor
  } as Movie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

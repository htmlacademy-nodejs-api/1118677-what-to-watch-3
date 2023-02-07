import * as jose from 'jose';
import crypto from 'crypto';
import {plainToInstance} from 'class-transformer';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';
import { Movie } from '../types/movie.type.js';
import { GenreType } from '../types/genre-type.enum.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, createdDate, genre, releaseDate, rating, previewVideo, video,
    actors, director, duration, commentCount, firstname, email, avatarPath, posterImage,
    backgroungImage, backgroungColor] = tokens;
  return {
    title,
    description,
    postDate: new Date(createdDate),
    genre: GenreType[genre as 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Horror' | 'Family' | 'Romance' | 'SciFi' | 'Thriller'],
    releaseDate: Number(releaseDate),
    rating: Number.parseInt(rating, 10),
    previewVideo,
    video,
    actors: actors.split(';'),
    director,
    duration: Number.parseInt(duration, 10),
    commentCount: Number.parseInt(commentCount, 10),
    user: {firstname, email, avatarPath},
    posterImage,
    backgroungImage,
    backgroungColor,
    isPromo: false,
    isFavorite: false
  } as Movie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('20d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

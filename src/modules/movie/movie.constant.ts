export const DEFAULT_MOVIE_COUNT = 60;
export const MOVIE_ID = 'movieId';
export const IMAGE = 'image';

export const TitleLength = {
  Min: 2,
  Max: 100,
} as const;

export const DescriptionLength = {
  Min: 20,
  Max: 1024,
} as const;

export const ReleaseDate = {
  Min: 1895,
  Max: new Date().getFullYear(),
} as const;

export const DirectorLength = {
  Min: 2,
  Max: 50,
} as const;

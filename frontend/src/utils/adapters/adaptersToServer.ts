import { GenreType } from '../../const.js';
import CreateCommentDto from '../../dto/comment/create-comment.dto.js';
import CreateMovieDto from '../../dto/movie/create-movie.dto.js';
import UpdateMovieDto from '../../dto/movie/update-movie.dto.js';
import CreateUserDto from '../../dto/user/create-user.dto.js';
import UserDto from '../../dto/user/user.dto.js';
import { Film } from '../../types/film.js';
import { NewFilm } from '../../types/new-film.js';
import { NewReview } from '../../types/new-review.js';
import { NewUser } from '../../types/new-user.js';
import { User } from '../../types/user.js';
import { /*checkGenre,*/ getTime } from './util';

export const adaptSignupToServer = (user: NewUser): CreateUserDto => ({
  firstname: user.name,
  email: user.email,
  avatarUrl: user.avatar,
  password: user.password
});

export const adaptUserToServer = (user: User): UserDto => ({
  firstname: user.name,
  email: user.email,
  avatarPath: user.avatarUrl
});

export const adaptCreateFilmToServer = (film: NewFilm): CreateMovieDto => ({
  title: film.name,
  description: film.description,
  postDate: getTime(),
  posterImage: film.posterImage,
  genre: film.genre as GenreType,
  releaseDate: film.released,
  previewVideo: film.previewVideoLink,
  video: film.videoLink,
  actors: film.starring,
  director: film.director,
  duration: film.runTime,
  backgroundImage: film.backgroundImage,
  backgroundColor: film.backgroundColor,
});

export const adaptEditFilmToServer = (film: Film): UpdateMovieDto => ({
  id: film.id,
  title: film.name,
  description: film.description,
  posterImage: film.posterImage,
  genre: film.genre as GenreType,
  rating: film.rating,
  releaseDate: film.released,
  previewVideo: film.previewVideoLink,
  video: film.videoLink,
  actors: film.starring,
  director: film.director,
  duration: film.runTime,
  backgroundImage: film.backgroundImage,
  backgroundColor: film.backgroundColor,
  isFavorite: film.isFavorite,
  user: adaptUserToServer(film.user),
});

export const adaptCreateCommentToServer = (comment: NewReview, id: string): CreateCommentDto => ({
  text: comment.comment,
  rating: comment.rating,
  postDate: getTime(),
  movieId: id,
});

export const adaptAvatarToServer = (file: File) => {
  const formData = new FormData();
  formData.set('avatar', file);

  return formData;
};

export const adaptImageToServer = (file: string) => {
  const formData = new FormData();
  formData.set('image', file);

  return formData;
};

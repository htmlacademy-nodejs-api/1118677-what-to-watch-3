import CommentDto from '../../dto/comment/comment.dto.js';
import ShortMovieDto from '../../dto/movie/short-movie.dto.js';
import MovieDto from '../../dto/movie/movie.dto.js';
import UserWithTokenDto from '../../dto/user/user-with-token.dto.js';
import UserDto from '../../dto/user/user.dto.js';
import { Film } from '../../types/film.js';
import { Review } from '../../types/review.js';
import { User } from '../../types/user.js';

export const adaptLoginToClient = (user: UserWithTokenDto): User => ({
  name: user.firstname,
  email: user.email,
  avatarUrl: user.avatarPath,
  token: user.token,
});

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.firstname,
  email: user.email,
  avatarUrl: user.avatarPath,
});


export const adaptFilmsToClient = (films: ShortMovieDto[]): Film[] =>
  films
    .filter((film: ShortMovieDto) => film.user !== null)
    .map((film: ShortMovieDto) => ({
      id: film.id,
      name: film.title,
      posterImage: film.posterImage,
      backgroundImage: '',
      backgroundColor: '',
      videoLink: '',
      previewVideoLink: film.previewVideo,
      description: '',
      rating: 0,
      director: '',
      starring: [],
      runTime: 0,
      genre: film.genre,
      released: 0,
      isFavorite: film.isFavorite,
      user: adaptUserToClient(film.user),
    }));

export const adaptFilmToClient = (film: MovieDto): Film => ({
  id: film.id,
  name: film.title,
  posterImage: film.posterImage,
  backgroundImage: film.backgroundImage,
  backgroundColor: film.backgroundColor,
  videoLink: film.video,
  previewVideoLink: film.previewVideo,
  description: film.description,
  rating: film.rating,
  director: film.director,
  starring: film.actors,
  runTime: film.duration,
  genre: film.genre,
  released: film.releaseDate,
  isFavorite: film.isFavorite,
  user: adaptUserToClient(film.user),
});

export const adaptCommentsToClient = (comments: CommentDto[]): Review[] =>
  comments
    .filter((comment: CommentDto) => comment.user !== null)
    .map((comment: CommentDto) => ({
      comment: comment.text,
      date: comment.postDate,
      id: comment.id,
      rating: comment.rating,
      user: adaptUserToClient(comment.user),
    }));

export const adaptCommentToClient = (comment: CommentDto): Review => ({
  comment: comment.text,
  rating: comment.rating,
  id: comment.id,
  user: adaptUserToClient(comment.user),
  date: comment.postDate,
});


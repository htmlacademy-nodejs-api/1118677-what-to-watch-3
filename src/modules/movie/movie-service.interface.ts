import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { Favorite } from './movie.constant.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(count?: number): Promise<DocumentType<MovieEntity>[] | null>;
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  findByGenreId(genreId: string, count?: number): Promise<DocumentType<MovieEntity>[]>;
  incCommentCount(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  findFavorite(): Promise<DocumentType<MovieEntity>[] | null>;
  changeFavoriteStatus(movieId: string, status: Favorite): Promise<DocumentType<MovieEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}

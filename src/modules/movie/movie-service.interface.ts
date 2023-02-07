import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface MovieServiceInterface extends DocumentExistsInterface{
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  find(count?: number): Promise<DocumentType<MovieEntity>[] | null>;
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateById(movieId: string, dto: Partial<UpdateMovieDto>): Promise<DocumentType<MovieEntity> | null>;
  findByGenreName(genre: string, count?: number): Promise<DocumentType<MovieEntity>[]>;
  incCommentCount(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateRating(filmId: string): Promise<DocumentType<MovieEntity> | null>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  findFavorite(): Promise<DocumentType<MovieEntity>[] | null>;
  changeFavoriteStatus(movieId: string, status: boolean): Promise<DocumentType<MovieEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}

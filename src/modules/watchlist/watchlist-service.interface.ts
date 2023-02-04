import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from '../movie/movie.entity.js';

export interface WatchlistServiceInterface {
  findFavorite(): Promise<DocumentType<MovieEntity>[] | null>;
  changeFavoriteStatus(movieId: string, status: boolean): Promise<DocumentType<MovieEntity> | null>;
}

import {DocumentType} from '@typegoose/typegoose';
import { WatchlistEntity } from './watchlist.entity.js';

export interface WatchlistServiceInterface {
  create(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity>>;
  add(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity> | null>;
  delete(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity> | null>;
  findById(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity> | null>;
}

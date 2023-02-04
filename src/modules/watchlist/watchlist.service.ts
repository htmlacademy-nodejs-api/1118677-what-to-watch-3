import {inject, injectable} from 'inversify';
import {WatchlistServiceInterface} from './watchlist-service.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {Component} from '../../types/component.types.js';
import {MovieEntity} from '../movie/movie.entity.js';

@injectable()
export default class WatchlistService implements WatchlistServiceInterface {
  constructor(
    @inject(Component.WatchlistModel) private readonly watchlistModel: types.ModelType<MovieEntity>,
  ) {}

  public async findFavorite(): Promise<DocumentType<MovieEntity>[] | null> {
    return this.watchlistModel
      .find({isFavorite: true})
      .populate(['userId'])
      .exec();
  }

  public async changeFavoriteStatus(
    movieId: string,
    status: boolean
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.watchlistModel
      .findByIdAndUpdate(movieId, {isFavorite: status}, {new: true})
      .populate(['userId'])
      .exec();
  }

}

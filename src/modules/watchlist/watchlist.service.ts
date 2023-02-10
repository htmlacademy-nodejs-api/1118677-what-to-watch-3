import {inject, injectable} from 'inversify';
import {WatchlistServiceInterface} from './watchlist-service.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {Component} from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { WatchlistEntity } from './watchlist.entity.js';

@injectable()
export default class WatchlistService implements WatchlistServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.WatchlistModel) private readonly watchlistModel: types.ModelType<WatchlistEntity>
  ) {}

  public async create(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity>> {
    const result = await this.watchlistModel.findOne({ userId: userId });
    if (result) {
      await this.add(movieId, userId);
      return result;
    } else {
      const userWatchlist = await this.watchlistModel
        .create({
          movieIds: [movieId],
          userId: userId
        });
      this.logger.info(`Created watchlist for userId: ${userId}`);
      return userWatchlist;
    }
  }

  public async add(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity> | null> {
    return await this.watchlistModel
      .findOneAndUpdate({ userId }, { $push: { movieIds: movieId } });
  }

  public async delete(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity> | null> {
    return this.watchlistModel
      .findOneAndUpdate(
        {
          userId: userId
        },
        {
          $pull: { movieIds: movieId }
        });
  }

  public async findById(movieId: string, userId: string): Promise<DocumentType<WatchlistEntity> | null> {
    return this.watchlistModel
      .findOne({movieIds: movieId, userId: userId});
  }

}

import {inject, injectable} from 'inversify';
import {MovieServiceInterface} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {DEFAULT_MOVIE_COUNT} from './movie.constant.js';
import {SortType} from '../../types/sort-type.enum.js';
import { Types } from 'mongoose';
import { CommentEntity } from '../comment/comment.entity.js';
import { WatchlistEntity } from '../watchlist/watchlist.entity.js';
import { GenreType } from '../../types/genre-type.enum.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.WatchlistModel) private readonly watchlistModel: types.ModelType<WatchlistEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.title}`);

    return result;
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findById(movieId)
      .populate(['userId'])
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel
      .find({}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['userId'])
      .exec();
  }

  public async findByMovieName(movieName: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findOne({ title: movieName })
      .exec();
  }

  public async deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndDelete(movieId)
      .exec();
  }

  public async updateById(movieId: string, dto: Partial<UpdateMovieDto>): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async findByGenreName(genre: GenreType, count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel
      .find({genre}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['userId'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.movieModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async updateRating(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    const result = await this.commentModel
      .aggregate([
        {
          $match: {
            movieId: new Types.ObjectId(movieId)
          }
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' }
          }
        }
      ])
      .exec();

    return this.movieModel
      .findByIdAndUpdate(movieId, {'$set': {
        rating: result[0]['avgRating'],
      }})
      .exec();
  }


  public async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findOne({isPromo: true})
      .populate(['userId'])
      .exec();
  }

  public async findFavorite(userId: string): Promise<DocumentType<MovieEntity>[]> {
    const favoriteMovies = await this.watchlistModel
      .findOne({ userId })
      .select('movieIds')
      .exec();
    if (!favoriteMovies?.movieIds) {
      return [];
    }
    return this.movieModel
      .aggregate([
        {
          $match: { _id: { $in: favoriteMovies.movieIds } }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $addFields: {
            userId: '$user',
            id: { $toString: '$_id' }
          }
        }
      ]);
  }

  public async changeFavoriteStatus(movieId: string, status: boolean)
  : Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, {
        '$set': {
          isFavorite: status,
        }
      }, { new: true })
      .populate('userId')
      .exec();
  }
}

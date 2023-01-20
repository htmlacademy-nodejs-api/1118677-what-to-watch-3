import {inject, injectable} from 'inversify';
import {MovieServiceInterface} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {DEFAULT_MOVIE_COUNT, Favorite} from './movie.constant.js';
import {SortType} from '../../types/sort-type.enum.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.title}`);

    return result;
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findById(movieId)
      .populate(['userId', 'genres'])
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel
      .find({}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['userId', 'genres'])
      .exec();
  }

  public async deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndDelete(movieId)
      .exec();
  }

  public async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, dto, {new: true})
      .populate(['userId', 'genres'])
      .exec();
  }

  public async findByGenreId(genreId: string, count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.movieModel
      .find({genres: genreId}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['userId', 'genres'])
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

  public async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findOne({isPromo: true})
      .populate(['userId', 'genres'])
      .exec();
  }

  public async findFavorite(): Promise<DocumentType<MovieEntity>[] | null> {
    return this.movieModel
      .find({isFavorite: true})
      .populate(['userId', 'genres'])
      .exec();
  }

  public async changeFavoriteStatus(
    movieId: string,
    status: Favorite
  ): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, {isFavorite: status}, {new: true})
      .populate(['userId', 'genres'])
      .exec();
  }
}

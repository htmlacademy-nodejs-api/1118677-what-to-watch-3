import {Request, Response} from 'express';
import * as core from 'express-serve-static-core';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/common.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import { MovieServiceInterface } from '../movie/movie-service.interface.js';
import ShortMovieResponse from '../movie/response/short-movie.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ChangeFavoriteStatusDto } from './dto/change-favorite-status.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { WatchlistServiceInterface } from './watchlist-service.interface.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import ShortFilmResponse from '../movie/response/short-movie.response.js';

type ParamsGetMovie = {
  movieId: string;
  status?: boolean;
}

@injectable()
export default class WatchlistController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.WatchlistServiceInterface) private readonly watchlistService: WatchlistServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for WatchlistController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(ChangeFavoriteStatusDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const { user } = req;
    const movies = await this.movieService.findFavorite(user.id);
    this.logger.info(`movies by findFavorite ${movies}`);
    this.ok(res, fillDTO(ShortFilmResponse, movies));
  }

  public async update(
    req: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, ChangeFavoriteStatusDto>,
    res: Response
  ): Promise<void> {
    const { body, params, user } = req;
    const movie = await this.movieService.changeFavoriteStatus(params.movieId, body.isFavorite);
    if (body.isFavorite) {
      const favorite = await this.watchlistService.findById(params.movieId, user.id);
      if (favorite) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `Movie ${params.movieId}) is already favorite`,
          'MovieController'
        );
      }
      await this.watchlistService.create(params.movieId, user.id);
    } else {
      await this.watchlistService.delete(params.movieId, user.id);
    }
    this.ok(res, fillDTO(ShortMovieResponse, movie));
  }
}

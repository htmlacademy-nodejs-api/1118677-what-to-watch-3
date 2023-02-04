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
import MovieResponse from '../movie/response/movie.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ChangeFavoriteStatusDto } from './dto/change-favorite-status.js';

type ParamsGetMovie = {
  movieId: string;
}

@injectable()
export default class WatchlistController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,

  ) {
    super(logger);

    this.logger.info('Register routes for WatchlistController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(ChangeFavoriteStatusDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]
    });
  }

  public async index(
    _req: Request,
    res: Response
  ): Promise<void> {
    const movies = await this.movieService.findFavorite();
    this.ok(res, fillDTO(MovieResponse, movies));
  }

  async update(
    req: Request<
      core.ParamsDictionary | ParamsGetMovie,
      Record<string, unknown>,
      ChangeFavoriteStatusDto
    >,
    res: Response
  ) {
    const {
      params: { movieId },
      body: { isFavorite },
    } = req;
    const movies = await this.movieService.changeFavoriteStatus(
      movieId,
      isFavorite
    );
    this.ok(res, fillDTO(MovieResponse, movies));

  }
}

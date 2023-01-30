import {Request, Response} from 'express';
import * as core from 'express-serve-static-core';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import MovieResponse from './response/movie.response.js';
import {fillDTO} from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { RequestQuery } from '../../types/request-query.type.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';

type ParamsGetMovie = {
  movieId: string;
}

type ParamsGetMovieByGenre = {
  genreId: string;
}
@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateMovieDto)
      ]});
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]
    });
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]});
    this.addRoute({path: '/:movieId', method: HttpMethod.Patch, handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(UpdateMovieDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]});
    this.addRoute({path: '/:genreId/genres', method: HttpMethod.Get, handler: this.findByGenre,
      // middlewares: [new ValidateObjectIdMiddleware('movieId')]
    });
    this.addRoute({path: '/:movieId/comments', method: HttpMethod.Get, handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ]});


    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.findPromo});
    this.addRoute({path: '/watchlist', method: HttpMethod.Get, handler: this.findFavorite});
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response): Promise<void> {
    const { movieId } = params;
    const movie = await this.movieService.findById(movieId);

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async index(
    req: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const limit = req.query.limit;
    const movies = await this.movieService.find(limit);
    this.ok(res, fillDTO(MovieResponse, movies));
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>,
    res: Response
  ): Promise<void> {

    const result = await this.movieService.create(body);
    const movie = await this.movieService.findById(result.id);
    this.created(res, fillDTO(MovieResponse, movie));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ): Promise<void> {
    const { movieId } = params;
    const movie = await this.movieService.deleteById(movieId);

    await this.commentService.deleteByMovieId(movieId);
    this.noContent(res, movie);
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, UpdateMovieDto>,
    res: Response
  ): Promise<void> {
    const { movieId } = params;
    const updateMovie = await this.movieService.updateById(movieId, body);

    this.ok(res, fillDTO(MovieResponse, updateMovie));
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByMovieId(params.movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async findByGenre(
    {params, query}: Request<core.ParamsDictionary | ParamsGetMovieByGenre, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findByGenreName(params.genreId, query.limit);
    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async findPromo(
    _req: Request,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findPromo();
    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async findFavorite(_req: Request, res: Response) {
    const movie = await this.movieService.findFavorite();
    this.ok(res, fillDTO(MovieResponse, movie));
  }

}

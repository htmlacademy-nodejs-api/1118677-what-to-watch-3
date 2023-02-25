import {Request, Response} from 'express';
import * as core from 'express-serve-static-core';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import MovieResponse from './response/movie.response.js';
import ShortMovieResponse from './response/short-movie.response.js';
import {fillDTO} from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import { RequestQuery } from '../../types/request-query.type.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.middleware.js';
import UploadPreviewImageResponse from './response/upload-preview-image.response.js';
import UploadPosterImageResponse from './response/upload-poster-image.response.js';
import UploadBackgroundImageResponse from './response/upload-background-image.response.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import { GenreType } from '../../types/genre-type.enum.js';
import { IMAGE, MOVIE_ID } from './movie.constant.js';

type ParamsGetMovie = {
  movieId: string;
}

type ParamsGetMovieByGenre = {
  genreId: GenreType;
}
@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateMovieDto)
      ]});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.findPromo});

    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware(MOVIE_ID),
        new DocumentExistsMiddleware(this.movieService, 'Movie', MOVIE_ID),
      ]
    });
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(MOVIE_ID),
        new DocumentExistsMiddleware(this.movieService, 'Movie', MOVIE_ID),
      ]});
    this.addRoute({path: '/:movieId', method: HttpMethod.Patch, handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(MOVIE_ID),
        new ValidateDtoMiddleware(UpdateMovieDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', MOVIE_ID),
      ]});

    this.addRoute({
      path: '/:movieId/image/preview',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(MOVIE_ID),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), IMAGE),
      ]
    });
    this.addRoute({
      path: '/:movieId/image/poster',
      method: HttpMethod.Post,
      handler: this.uploadPosterImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(MOVIE_ID),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), IMAGE),
      ]
    });
    this.addRoute({
      path: '/:movieId/image/background',
      method: HttpMethod.Post,
      handler: this.uploadBackgroundImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(MOVIE_ID),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), IMAGE),
      ]
    });
    this.addRoute({path: '/genres/:genreId', method: HttpMethod.Get, handler: this.findByGenre,
    });
    this.addRoute({path: '/:movieId/comments', method: HttpMethod.Get, handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware(MOVIE_ID),
        new DocumentExistsMiddleware(this.movieService, 'Movie', MOVIE_ID),
      ]});
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
    this.ok(res, fillDTO(ShortMovieResponse, movies));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;

    const existMovie = await this.movieService.findByMovieName(body.title);
    if (existMovie) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Movie with name «${body.title}» exists.`,
        'MovieController'
      );
    }

    const result = await this.movieService.create({...body, userId: user.id});
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
    {body, params, user}: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, UpdateMovieDto>,
    res: Response
  ): Promise<void> {
    const { movieId } = params;

    const movie = await this.movieService.findById(movieId);
    this.logger.info(`movie?.userId ${movie?.userId}`);
    this.logger.info(`userId ${user.id}`);
    if (movie?.userId?._id.toString() !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User don't have root to change movie (id: ${movieId})`,
        'MovieController'
      );
    }
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

  public async uploadPreviewImage(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response) {
    const {movieId} = req.params;
    const updateDto = { previewVideo: req.file?.filename };
    await this.movieService.updateById(movieId, updateDto);
    this.created(res, fillDTO(UploadPreviewImageResponse, {updateDto}));
  }

  public async uploadPosterImage(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response) {
    const {movieId} = req.params;
    const updateDto = { posterImage: req.file?.filename };
    await this.movieService.updateById(movieId, updateDto);
    this.created(res, fillDTO(UploadPosterImageResponse, {updateDto}));
  }

  public async uploadBackgroundImage(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response) {
    const {movieId} = req.params;
    const updateDto = { backgroundImage: req.file?.filename };
    await this.movieService.updateById(movieId, updateDto);
    this.created(res, fillDTO(UploadBackgroundImageResponse, {updateDto}));
  }

  public async findByGenre(
    {params, query}: Request<core.ParamsDictionary | ParamsGetMovieByGenre, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const movies = await this.movieService.findByGenreName(params.genreId, query.limit);
    this.ok(res, fillDTO(ShortMovieResponse, movies));
  }

  public async findPromo(
    _req: Request,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findPromo();
    this.ok(res, fillDTO(MovieResponse, movie));
  }

}

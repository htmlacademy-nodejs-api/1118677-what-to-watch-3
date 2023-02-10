import {Request, Response} from 'express';
import {inject} from 'inversify';
import {StatusCodes} from 'http-status-codes';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {MovieServiceInterface} from '../movie/movie-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/common.js';
import CommentResponse from './response/comment.response.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';

export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]});
  }

  public async create(
    req: Request<object, object, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const {body} = req;

    if (!await this.movieService.exists(body.movieId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${body.movieId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({ ...body, userId: req.user.id });
    await this.movieService.incCommentCount(body.movieId);
    await this.movieService.updateRating(body.movieId);
    this.created(res, fillDTO(CommentResponse, comment));
  }
}

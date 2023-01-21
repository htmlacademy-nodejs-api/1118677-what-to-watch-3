import {Request, Response} from 'express';
import * as core from 'express-serve-static-core';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import MovieResponse from './response/movie.response.js';
import {fillDTO} from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
// import HttpError from '../../common/errors/http-error.js';
import UpdateMovieDto from './dto/update-movie.dto.js';

type RequestQuery = {
  limit?: number;
}

type ParamsFindMovies = {
  movieId: string;
}

type ParamsFindMoviesByGenre = {
  genre: string;
}
@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.findById
    });
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.delete
    });
    this.addRoute({path: '/:movieId', method: HttpMethod.Patch, handler: this.update,
    });
    this.addRoute({path: '/genre/:genre', method: HttpMethod.Get, handler: this.findByGenre});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.findPromo});
    this.addRoute({path: '/watchlist', method: HttpMethod.Get, handler: this.findFavorite});


  }

  public async index(
    req: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response): Promise<void> {
    const limit = req.query?.limit;
    const movies = await this.movieService.find(limit);
    const movieResponse = fillDTO(MovieResponse, movies);
    this.send(res, StatusCodes.OK, movieResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>,
    res: Response): Promise<void> {

    const result = await this.movieService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(MovieResponse, result)
    );
  }

  public async findById(req: Request, res: Response) {
    const {
      params: { movieId },
    } = req;

    const result = await this.movieService.findById(movieId);
    this.send(res, StatusCodes.OK, fillDTO(MovieResponse, result));
  }

  public async delete(req: Request, res: Response) {
    const {params: { movieId }} = req;
    await this.movieService.deleteById(movieId);
    this.send(res, StatusCodes.NO_CONTENT, {});
  }

  public async update(
    req: Request<core.ParamsDictionary | ParamsFindMovies, Record<string, unknown>, UpdateMovieDto>,
    res: Response
  ) {
    const {
      body,
      params: { movieId }
    } = req;
    const result = await this.movieService.updateById(movieId, body);
    this.send(res, StatusCodes.OK, fillDTO(MovieResponse, result));
  }

  public async findByGenre(
    {params, query}: Request<core.ParamsDictionary | ParamsFindMoviesByGenre, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const result = await this.movieService.findByGenreName(params.genre, query.limit);
    this.send(res, StatusCodes.OK, fillDTO(MovieResponse, result));
  }

  public async findPromo(
    _req: Request,
    res: Response
  ): Promise<void> {
    const result = await this.movieService.findPromo();
    this.send(res, StatusCodes.OK, fillDTO(MovieResponse, result));
  }

  public async findFavorite(_req: Request, res: Response) {
    const result = await this.movieService.findFavorite();
    this.send(res, StatusCodes.OK, fillDTO(MovieResponse, result));
  }

}

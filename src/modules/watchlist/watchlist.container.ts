import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {ControllerInterface} from '../../common/controller/controller.interface.js';
import WatchlistController from './watchlist.controller.js';
import {Component} from '../../types/component.types.js';
import { WatchlistServiceInterface } from './watchlist-service.interface.js';
import WatchlistService from './watchlist.service.js';
import { MovieEntity, MovieModel } from '../movie/movie.entity.js';

const watchlistContainer = new Container();
watchlistContainer.bind<WatchlistServiceInterface>(Component.WatchlistServiceInterface).to(WatchlistService);
watchlistContainer.bind<types.ModelType<MovieEntity>>(Component.WatchlistModel).toConstantValue(MovieModel);
watchlistContainer.bind<ControllerInterface>(Component.WatchlistController).to(WatchlistController).inSingletonScope();

export {watchlistContainer};

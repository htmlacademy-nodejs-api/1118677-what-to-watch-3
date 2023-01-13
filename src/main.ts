import 'reflect-metadata';
import {Container} from 'inversify';
import {applicationContainer} from './app/application.container.js';
import {userContainer} from './modules/user/user.container.js';
import {genreContainer} from './modules/genre/genre.container.js';
import {movieContainer} from './modules/movie/movie.container.js';
import Application from './app/application.js';
import {Component} from './types/component.types.js';

const mainContainer = Container.merge(
  applicationContainer,
  userContainer,
  genreContainer,
  movieContainer
);

async function bootstrap() {
  const application = mainContainer.get<Application>(Component.Application);
  await application.init();
}

bootstrap();

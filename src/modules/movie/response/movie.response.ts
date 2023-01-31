import {Expose, Type} from 'class-transformer';
// import GenreResponse from '../../genre/response/genre.response.js';
import UserResponse from '../../user/response/user.response.js';

export default class MovieResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public releaseDate!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewVideo!: string;

  @Expose()
  public video!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public duration!: number;

  @Expose()
  public commentsCount!: number;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterImage!: string;

  @Expose()
  public isPromo!: boolean;

  @Expose()
  public isFavorite!: boolean;
}

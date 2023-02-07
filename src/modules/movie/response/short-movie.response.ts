import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class ShortFilmResponse {
  @Expose()
  public title!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  public genre!: string;

  @Expose()
  public previewVideo!: string;

  @Expose()
  public commentsCount!: number;

  @Expose({ name: 'userId' })
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterImage!: string;

  @Expose()
  public isFavorite!: boolean;
}

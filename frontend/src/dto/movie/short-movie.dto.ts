import UserDto from '../user/user.dto';

export default class ShortMovieDto {
  public id!: string;

  public title!: string;

  public postDate!: string;

  public genre!: string;

  public previewVideo!: string;

  public commentCount!: number;

  public user!: UserDto;

  public posterImage!: string;

  public isFavorite!: boolean;
}

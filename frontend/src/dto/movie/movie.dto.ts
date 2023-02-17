import { GenreType } from '../../const';
import UserDto from '../user/user.dto';

export default class MovieDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public postDate!: string;

  public genre!: GenreType;

  public releaseDate!: number;

  public rating!: number;

  public previewVideo!: string;

  public video!: string;

  public actors!: string[];

  public director!: string;

  public duration!: number;

  public commentCount!: number;

  public user!: UserDto;

  public posterImage!: string;

  public backgroundImage!: string;

  public backgroundColor!: string;

  public isPromo?: boolean;

  public isFavorite!: boolean;
}

import { GenreType } from '../../const.js';
import UserDto from '../user/user.dto.js';

export default class UpdateMovieDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public postDate!: Date;

  public genre!: GenreType;

  public releaseDate!: number;

  public rating!: number;

  public previewVideo!: string;

  public video!: string;

  public actors!: string[];

  public director!: string;

  public duration!: number;

  public user!: UserDto;

  public posterImage!: string;

  public backgroundImage!: string;

  public backgroundColor!: string;

  public isFavorite!: boolean;
  public isPromo!: boolean;
}

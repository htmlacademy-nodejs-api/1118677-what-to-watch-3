import { GenreType } from '../../const.js';

export default class CreateMovieDto {
  public title!: string;

  public description!: string;

  public postDate!: string;

  public genre!: GenreType;

  public releaseDate!: number;

  public previewVideo!: string;

  public video!: string;

  public actors!: string[];

  public director!: string;

  public duration!: number;

  public posterImage!: string;

  public backgroundImage!: string;

  public backgroundColor!: string;

}

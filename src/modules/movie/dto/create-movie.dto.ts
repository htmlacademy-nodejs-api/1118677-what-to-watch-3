import { Genre } from '../../../types/genre.type.js';

export default class CreateMovieDto {
  public title!: string;
  public description!: string;
  public postDate!: string;
  public genres!: Genre[];
  public releaseDate!: string;
  public previewVideo!: string;
  public video!: string;
  public actors!: string[];
  public director!: string;
  public duration!: number;
  public userId!: string;
  public posterImage!: string;
  public backgroungImage!: string;
  public backgroungColor!: string;
}

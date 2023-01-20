import { Actor } from '../../../types/actor.type.js';
import { Genre } from '../../../types/genre.type.js';

export default class CreateMovieDto {
  public title!: string;
  public description!: string;
  public postDate!: string;
  public genres!: Genre[];
  public releaseDate!: string;
  public rating!: number;
  public previewVideo!: string;
  public video!: string;
  public actors!: Actor[];
  public director!: string;
  public duration!: number;
  public commentCount!: number;
  public posterImage!: string;
  public backgroungImage!: string;
  public backgroungColor!: string;
}

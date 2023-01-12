import { Actor } from '../../../types/actor.type.js';
import { Genre } from '../../../types/genre.type.js';

export default class CreateMovieDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public genres!: Genre[];
  public releaseDate!: string;
  public rating!: number;
  public previewVideo!: string;
  public video!: string;
  public actors!: Actor[];
  public director!: string;
  public duration!: number;
  public commentNumber!: number;
  public userId!: string;
  public poster!: string;
  public backgroungImage!: string;
  public backgroungColor!: string;
}

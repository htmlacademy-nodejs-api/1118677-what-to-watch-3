import { GenreType } from '../../../types/genre-type.enum.js';
import {IsArray, IsDateString, IsInt, Max, Min, IsString, IsEnum, Length, Contains} from 'class-validator';
import { descriptionLength, directorLength, releaseDate, titleLength } from '../movie.constant.js';


export default class CreateMovieDto {
  @IsString({message: 'title is required'})
  @Length(titleLength.MIN, titleLength.MAX, {message: 'Min length is 2, max length is 100'})
  public title!: string;

  @IsString({message: 'description is required'})
  @Length(descriptionLength.MIN, descriptionLength.MAX, {message: 'Min length is 20, max length is 1024'})
  public description!: string;

  @IsDateString({}, {message: 'publictionDate must be valid ISO date'})
  public postDate!: Date;

  @IsEnum(GenreType, {message: 'Genre must be comedy, crime, documentary, drama, horror, family, romance, scifi or thriller' })
  public genre!: GenreType;

  @IsInt({message: 'releaseDate must be an integer'})
  @Min(releaseDate.MIN, {message: 'Minimum releaseDate is 1895'})
  @Max(releaseDate.MAX, {message: 'Maximum releaseDate is current year'})
  public releaseDate!: number;

  @IsString({message: 'previewVideo is required'})
  public previewVideo!: string;

  @IsString({message: 'video is required'})
  public video!: string;

  @IsArray({message: 'Field actors must be an array'})
  public actors!: string[];

  @IsString({message: 'director is required'})
  @Length(directorLength.MIN, directorLength.MAX, {message: 'Min length is 2, max length is 50'})
  public director!: string;

  @IsInt({message: 'duration must be an integer'})
  public duration!: number;

  @IsString({message: 'posterImage is required'})
  @Contains('.jpg', {message: 'posterImage field must be a link on .jpg format'})
  public posterImage!: string;

  @IsString({message: 'backgroundImage is required'})
  @Contains('.jpg', {message: 'backgroundImage field must be a link on .jpg format'})
  public backgroundImage!: string;

  @IsString({message: 'backgroundColor is required'})
  public backgroundColor!: string;

  public userId!: string;
}

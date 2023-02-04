import { GenreType } from '../../../types/genre-type.enum.js';
import {IsArray, IsDateString, IsInt, IsMongoId, Max, MaxLength, Min, MinLength, IsString, IsEnum} from 'class-validator';


export default class CreateMovieDto {
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsDateString({}, {message: 'publictionDate must be valid ISO date'})
  public postDate!: Date;

  @IsEnum(GenreType, {message: 'type must be GenreType'})
  public genre!: GenreType;

  @IsInt({message: 'releaseDate must be an integer'})
  @Min(1895, {message: 'Minimum releaseDate is 1895'})
  @Max(new Date().getFullYear(), {message: 'Maximum releaseDate is current year'})
  public releaseDate!: number;

  @IsString({message: 'previewVideoLink is required'})
  public previewVideo!: string;

  @IsString({message: 'video is required'})
  public video!: string;

  @IsArray({message: 'Field actors must be an array'})
  public actors!: string[];

  @IsString({message: 'director is required'})
  public director!: string;

  @IsInt({message: 'duration must be an integer'})
  public duration!: number;

  @IsString({message: 'posterImage is required'})
  public posterImage!: string;

  @IsString({message: 'backgroungImage is required'})
  public backgroungImage!: string;

  @IsString({message: 'backgroundColor is required'})
  public backgroungColor!: string;

  @IsMongoId({message: 'userId field must be valid an id'})
  public userId!: string;
}

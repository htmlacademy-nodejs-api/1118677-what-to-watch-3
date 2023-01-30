import { GenreType } from '../../../types/genre-type.enum.js';
import {IsArray, IsDateString, IsInt, Max, MaxLength, Min, MinLength, IsString, IsEnum, IsOptional} from 'class-validator';

export default class UpdateMovieDto {
  @IsOptional()
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'publictionDate must be valid ISO date'})
  public postDate?: Date;

  @IsOptional()
  @IsEnum(GenreType, {message: 'type must be GenreType'})
  public genre?: GenreType;

  @IsOptional()
  @IsInt({message: 'releaseDate must be an integer'})
  @Min(1895, {message: 'Minimum releaseDate is 1895'})
  @Max(new Date().getFullYear(), {message: 'Maximum releaseDate is current year'})
  public releaseDate?: number;

  // public rating?: number;
  @IsOptional()
  @IsString({message: 'previewVideoLink is required'})
  public previewVideo?: string;

  @IsOptional()
  @IsString({message: 'video is required'})
  public video?: string;

  @IsOptional()
  @IsArray({message: 'Field actors must be an array'})
  public actors?: string[];

  @IsOptional()
  @IsString({message: 'director is required'})
  public director?: string;

  @IsOptional()
  @IsInt({message: 'duration must be an integer'})
  public duration?: number;

  // public commentCount?: number;
  @IsOptional()
  @IsString({message: 'posterImage is required'})
  public posterImage?: string;

  @IsOptional()
  @IsString({message: 'backgroungImage is required'})
  public backgroungImage?: string;

  @IsOptional()
  @IsString({message: 'backgroundColor is required'})
  public backgroungColor?: string;
}

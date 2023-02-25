import { GenreType } from '../../../types/genre-type.enum.js';
import {IsArray, IsDateString, IsInt, Max, Min, IsString, IsEnum, IsOptional, IsBoolean, Length, Contains} from 'class-validator';
import { DescriptionLength, DirectorLength, ReleaseDate, TitleLength } from '../movie.constant.js';

export default class UpdateMovieDto {
  @IsOptional()
  @Length(TitleLength.Min, TitleLength.Max, {message: 'Min length is 2, max length is 100'})
  public title?: string;

  @IsOptional()
  @Length(DescriptionLength.Min, DescriptionLength.Max, {message: 'Min length is 20, max length is 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'publictionDate must be valid ISO date'})
  public postDate?: Date;

  @IsOptional()
  @IsEnum(GenreType, {message: 'type must be GenreType'})
  public genre?: GenreType;

  @IsOptional()
  @IsInt({message: 'releaseDate must be an integer'})
  @Min(ReleaseDate.Min, {message: 'Minimum releaseDate is 1895'})
  @Max(ReleaseDate.Max, {message: 'Maximum releaseDate is current year'})
  public releaseDate?: number;

  @IsOptional()
  @IsString({message: 'previewVideoLink is string'})
  public previewVideo?: string;

  @IsOptional()
  @IsString({message: 'video is string'})
  public video?: string;

  @IsOptional()
  @IsArray({message: 'Field actors must be an array'})
  public actors?: string[];

  @IsOptional()
  @IsString({message: 'director is string'})
  @Length(DirectorLength.Min, DirectorLength.Max, {message: 'Min length is 2, max length is 50'})
  public director?: string;

  @IsOptional()
  @IsInt({message: 'duration must be an integer'})
  public duration?: number;

  @IsOptional()
  @Contains('.jpg', {message: 'posterImage field must be a link on .jpg format'})
  public posterImage?: string;

  @IsOptional()
  @Contains('.jpg', {message: 'backgroundImage field must be a link on .jpg format'})
  public backgroundImage?: string;

  @IsOptional()
  @IsString({message: 'backgroundColor is string'})
  public backgroundColor?: string;

  @IsOptional()
  @IsBoolean({message: 'isPromo must be boolean'})
  public isPromo?: boolean;
}

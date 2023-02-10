import typegoose, {defaultClasses, getModelForClass, Ref, Severity} from '@typegoose/typegoose';
import { GenreType } from '../../types/genre-type.enum.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({ default: new Date() })
  public postDate!: Date;

  @prop({
    type: () => String,
    enum: GenreType,
    required: true
  })
  public genre!: GenreType;

  @prop({required: true})
  public releaseDate!: number;

  @prop({default: 0})
  public rating!: number;

  @prop({default: ''})
  public previewVideo!: string;

  @prop({required: true})
  public video!: string;

  @prop({required: true})
  public actors!: string[];

  @prop({required: true})
  public director!: string;

  @prop({required: true})
  public duration!: number;

  @prop({default: 0})
  public commentCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({default: ''})
  public posterImage!: string;

  @prop({default: ''})
  public backgroundImage!: string;

  @prop({required: true})
  public backgroundColor!: string;

  @prop({default: false})
  public isPromo!: boolean;
}

export const MovieModel = getModelForClass(MovieEntity);

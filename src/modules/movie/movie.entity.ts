import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {GenreEntity} from '../genre/genre.entity.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

class Actor {
  @prop()
  public name?: string;
}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({ default: new Date().toISOString() })
  public postDate!: string;

  @prop({
    ref: GenreEntity,
    required: true,
    default: [],
    _id: false
  })
  public genres!: Ref<GenreEntity>[];

  @prop({required: true})
  public releaseDate!: string;

  @prop({default: 0})
  public rating!: number;

  @prop({default: ''})
  public previewVideo!: string;

  @prop({required: true})
  public video!: string;

  @prop({type: () => [Actor]})
  public actors!: Actor[];

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
  public backgroungImage!: string;

  @prop({required: true})
  public backgroungColor!: string;

  @prop({default: false})
  public isPromo!: boolean;

  @prop({default: false})
  public isFfvorite!: boolean;
}

export const MovieModel = getModelForClass(MovieEntity);

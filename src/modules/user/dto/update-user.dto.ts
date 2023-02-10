import {IsOptional, IsString, Length, Validate} from 'class-validator';
import { CustomAvatar } from '../../../utils/custom-avatar.js';
import { userNameLength } from '../user.constant.js';
export default class UpdateUserDto {
  @IsOptional()
  @Validate(CustomAvatar, {message: 'avatarUrl field must be a link on .jpg or .png format'})
  public avatarPath?: string;

  @IsOptional()
  @IsString({message: 'firstname is string'})
  @Length(userNameLength.MIN, userNameLength.MAX,{message: 'Min length is 1, max is 15'})
  public firstname?: string;
}

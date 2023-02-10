import {IsEmail, IsString, Length} from 'class-validator';
import { userNameLength } from '../user.constant.js';
export default class CreateUserDto {
  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsString({message: 'firstname is required'})
  @Length(userNameLength.MIN, userNameLength.MAX,{message: 'Min length is 1, max is 15'})
  public firstname!: string;

  @IsString({message: 'password is required'})
  @Length(6, 12, {message: 'Min length for password is 6, max is 12'})
  public password!: string;
}

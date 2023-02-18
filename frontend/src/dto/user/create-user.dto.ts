export default class CreateUserDto {
  public firstname!: string;

  public email!: string;

  public avatarUrl!: File | undefined;

  public password!: string;
}

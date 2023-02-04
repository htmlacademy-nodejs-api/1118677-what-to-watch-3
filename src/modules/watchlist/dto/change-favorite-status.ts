import { IsBoolean } from 'class-validator';

export class ChangeFavoriteStatusDto {
  @IsBoolean({ message: 'Invalid passed value' })
  public isFavorite!: boolean;
}

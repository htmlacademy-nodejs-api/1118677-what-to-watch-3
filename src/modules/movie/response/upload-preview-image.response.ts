import {Expose} from 'class-transformer';

export default class UploadPreviewImageResponse {
  @Expose()
  public previewVideoImage!: string;
}

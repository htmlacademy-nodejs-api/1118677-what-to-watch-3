import { readFileSync } from 'fs';
import { Movie } from '../../types/movie.type.js';
// import { OfferType } from '../../types/offer-type.enum.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Movie[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        title, description, createdDate, genres, releaseDate, rating, previewVideo, video,
        actors, director, duration, commentNumber, firstname, email, avatarPath, poster,
        backgroungImage, backgroungColor
      ]) => ({
        title,
        description,
        postDate: new Date(createdDate),
        genres: genres.split(';').map((name) => ({name})),
        releaseDate,
        rating: Number.parseInt(rating, 10),
        previewVideo,
        video,
        actors: actors.split(';').map((name) => ({name})),
        director,
        duration: Number.parseInt(duration, 10),
        commentNumber: Number.parseInt(commentNumber, 10),
        user: {firstname, email, avatarPath},
        poster,
        backgroungImage,
        backgroungColor

      }));
  }
}

import { GenreType } from './genre-type.enum.js';
import { User } from './user.type.js';

export type Movie = {
   title: string;
   description: string;
   postDate: Date;
   genre: GenreType;
   releaseDate: number;
   rating: number;
   previewVideo: string;
   video: string;
   actors: string[];
   director: string;
   duration: number;
   commentCount: number;
   user: User;
   posterImage: string;
   backgroundImage: string;
   backgroundColor: string;
   isPromo: boolean;
 }

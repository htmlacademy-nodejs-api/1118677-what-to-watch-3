import { Genre } from './genre.type.js';
import { User } from './user.type.js';

export type Movie = {
   title: string;
   description: string;
   postDate: string;
   genres: Genre[];
   releaseDate: string;
   rating: number;
   previewVideo: string;
   video: string;
   actors: string[];
   director: string;
   duration: number;
   commentCount: number;
   user: User;
   posterImage: string;
   backgroungImage: string;
   backgroungColor: string;
   isPromo: boolean;
   isFavorite: boolean;
 }

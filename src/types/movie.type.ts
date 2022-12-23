import { Actor } from './actor.type.js';
import { Genre } from './genre.type.js';
import { User } from './user.type.js';

export type Movie = {
   title: string;
   description: string;
   postDate: Date;
   genres: Genre[];
   releaseDate: string;
   rating: number;
   previewVideo: string;
   video: string;
   actors: Actor[];
   director: string;
   duration: number;
   commentNumber: number;
   user: User;
   poster: string;
   backgroungImage: string;
   backgroungColor: string;
 }

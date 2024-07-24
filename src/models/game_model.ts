import { Schema, Document, model } from "mongoose";

//creating and exporting an interface
export interface IGame extends Document {
  name: string;
  genres: string[];
  platforms: string[];
  releaseYear: number;
  developer: string;
}

//creating an schema || const gameSchema: IGame = new Schema({...})
const gameSchema = new Schema<IGame>({
  name: {
    type: String,
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  platforms: {
    type: [String],
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  developer: {
    type: String,
    required: true,
  },
});



export const Game = model<IGame>("Game", gameSchema);

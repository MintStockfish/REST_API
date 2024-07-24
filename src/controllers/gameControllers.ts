import { Request, response, Response } from "express";
import { Game } from "../models/game_model";
import { gameSchema } from "../utils/dto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user_model";

import {
  addGameService,
  buyGameService,
  updateGameService,
  deleteGameService,
} from "../services/gameService";

const getGames = async (req: Request, res: Response) => {
  //function to get list of all games
  const games = await Game.find();
  return res.status(200).json(games);
};

const addGame = async (req: Request, res: Response) => {
  // function for add game in the store [only "Admin" role]
  const { name, genres, platforms, releaseYear, developer, accessToken } =
    req.body;
  try {
    const { error, value } = gameSchema.validate({
      name,
      genres,
      platforms,
      releaseYear,
      developer,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }
    const response = await addGameService(
      name,
      genres,
      platforms,
      releaseYear,
      developer,
      accessToken
    );
    if (response === "alreadyExists") {
      return res
        .status(409)
        .json({ message: "game with this name already exists." });
    } else if (response == "accessDenied") {
      return res
        .status(403)
        .json({ message: "you don't have permission to add games" });
    }
    return res.status(201).json({ message: "game was added" });
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "JWT token is expired, please log in one more time" });
    }
    return res.status(500).json({ message: "failed to add the game..." });
  }
};

const buyGame = async (req: Request, res: Response) => {
  //function for buy the game
  const { name, accessToken } = req.body;
  try {
    const response = await buyGameService(name, accessToken);
    if (response === "hasAlreadyBeenPurchased") {
      return res.status(409).json({ message: "you already bought this game" });
    }
    return res
      .status(201)
      .json({ message: "you successfully bought the game" });
  } catch (error: any) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "JWT token is expired, please log in one more time" });
    }
    return res.status(500).json({ message: "failed to buy the game" });
  }
};

const updateGame = async (req: Request, res: Response) => {
  // function for update game in the store [only "Admin" role]
  const {
    nameToUpdate,
    name,
    genres,
    platforms,
    releaseYear,
    developer,
    accessToken,
  } = req.body;
  try {
    const { error, value } = gameSchema.validate({
      name,
      genres,
      platforms,
      releaseYear,
      developer,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }

    const response = await updateGameService(
      nameToUpdate,
      name,
      genres,
      platforms,
      releaseYear,
      developer,
      accessToken
    );

    switch (response) {
      case "accessDenied":
        return res
          .status(403)
          .json({ message: "you don't have permission to update games" });
      case "gameWithThisNameAlreadyExists":
        return res.status(409).json({ message: "this name already in use" });
      case "gameWithThisNameIsNotExisting":
        return res.status(404).json({ message: "game is not found" });
      default:
        return res.status(201).json({ message: "game was updated" });
    }
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "JWT token is expired, please log in one more time" });
    }
    return res.status(500).json({ message: "failed to update the game..." });
  }
};

const deleteGame = async (req: Request, res: Response) => {
  //function for delete the game [only "Admin" role]
  const { nameToDelete, accessToken } = req.query as {
    nameToDelete?: string;
    accessToken?: string;
  };
  try {
    const response = await deleteGameService(
      nameToDelete ?? "",
      accessToken ?? ""
    );

    switch (response) {
      case "accessDenied":
        return res
          .status(403)
          .json({ message: "you don't have permission to delete games" });
      case "gameWithThisNameIsNotExisting":
        return res.status(404).json({ message: "game is not found" });
      default:
        return res.status(200).json({ message: "game is deleted" });
    }
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "JWT token is expired, please log in one more time" });
    }
    return res.status(500).json({ message: "failed to delete the game..." });
  }
};

export { getGames, addGame, buyGame, updateGame, deleteGame };

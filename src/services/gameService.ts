import { Game } from "../models/game_model";
import { User } from "../models/user_model";
import jwt, { JwtPayload } from "jsonwebtoken";

const addGameService = async (
  name: string,
  genres: string[],
  platforms: string[],
  releaseYear: number,
  developer: string,
  accessToken: string
) => {
  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET ?? ""
  ) as JwtPayload;
  if (decoded.role !== "Admin") {
    return "accessDenied";
  }
  if (await Game.findOne({ name })) {
    return "alreadyExists";
  }

  await Game.create({
    name,
    genres,
    platforms,
    releaseYear,
    developer,
  });
};

const buyGameService = async (name: string, accessToken: string) => {
  const { username } = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET ?? ""
  ) as JwtPayload;

  const user = await User.findOne({ name: username });
  let purchases = user?.purchases;
  if (user?.purchases) {
    if (purchases?.includes(name)) {
      return "hasAlreadyBeenPurchased";
    }
    purchases = [...user.purchases, name];
  } else {
    purchases = [name];
  }

  await User.updateOne(
    { name: username },
    { $set: { purchases } },
    { upsert: true }
  );
};

const updateGameService = async (
  nameToUpdate: string,
  name: string,
  genres: string[],
  platforms: string[],
  releaseYear: number,
  developer: string,
  accessToken: string
) => {
  const { role } = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET ?? ""
  ) as JwtPayload;
  if (role !== "Admin") {
    return "accessDenied";
  } else if (!(await Game.findOne({ name: nameToUpdate }))) {
    return "gameWithThisNameIsNotExisting";
  }
  const games = await Game.find({ name: { $ne: nameToUpdate } });
  if (games.some((game) => game.name === nameToUpdate)) {
    return "gameWithThisNameAlreadyExists";
  }
  await Game.updateOne(
    { name: nameToUpdate },
    {
      name,
      genres,
      platforms,
      releaseYear,
      developer,
    }
  );
};

const deleteGameService = async (nameToDelete: string, accessToken: string) => {
  const { role } = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET ?? ""
  ) as JwtPayload;
  if (role !== "Admin") {
    return "accessDenied";
  } else if (!(await Game.findOne({ name: nameToDelete }))) {
    return "gameWithThisNameIsNotExisting";
  }

  await Game.deleteOne({ name: nameToDelete });
};

export { addGameService, buyGameService, updateGameService, deleteGameService };

import express from "express";
const router = express.Router();
import {
  getGames,
  addGame,
  buyGame,
  updateGame,
  deleteGame
} from "../controllers/gameControllers";

router.get("/games", getGames);
router.post("/addGame", addGame);
router.post("/buyGame", buyGame);
router.put("/updateGame", updateGame);
router.delete("/deleteGame", deleteGame)

export { router as gameRouter };

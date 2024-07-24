import express, { Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import { gameRouter } from "./routes/gameRoutes";
import { authRouter } from "./routes/authRoutes";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;

// const corsOptions = { if there is a client
//   credentials: true,
//   origin: ["http://localhost:####"],
// };

// Middlewares
app.use(cors());
app.use(express.json());
app.use(gameRouter);
app.use(authRouter);

// Connecting to MongoDB
mongoose
  .connect(`${process.env.DB_URL}`)
  .then(() => {
    console.log("• Database is connected");
  })
  .catch((err) => {
    console.error("• Connection is failed:", err);
  });

// Running the server
app.listen(PORT, () => {
  console.log(`\n• Server is running on port ${PORT}`);
});

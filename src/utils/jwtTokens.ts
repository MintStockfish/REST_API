import jwt from "jsonwebtoken";
import { IUser } from "../models/user_model";

const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.name,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: process.env.JWT_ACCESS_EXP }
  );
};

const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.name,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXP }
  );
};

const confirmAccessToken = (accessToken: string) => {
  const decoded = jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET ?? ""
  ) as jwt.JwtPayload;
  return decoded.username ? {success: true, username: decoded.username} : false;
};

const confirmRefreshToken = (refresh_token: string) => {
  const decoded = jwt.verify(
    refresh_token,
    process.env.JWT_REFRESH_SECRET ?? ""
  ) as jwt.JwtPayload;
  return decoded.username ? {success: true, username: decoded.username} : false;
}

export { generateAccessToken, generateRefreshToken, confirmAccessToken, confirmRefreshToken };

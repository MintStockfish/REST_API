import bcrypt from "bcryptjs";
import { User } from "../models/user_model";
import {
  generateAccessToken,
  generateRefreshToken,
  confirmAccessToken,
  confirmRefreshToken,
} from "../utils/jwtTokens";

const loginService = async (name: string, password: string) => {
  const user = await User.findOne({ name: name });
  if (!user) {
    return "failure";
  }
  const isMatch = await bcrypt.compare(password, user?.password);
  if (isMatch) {
    const access_token = generateAccessToken(user);
    const refresh_token = generateRefreshToken(user);

    await User.updateOne({ name }, { $set: { refresh_token } });
    return { access_token, refresh_token };
  } else {
    return "failure";
  }
};
const registerService = async (
  name: string,
  password: string,
  email: string
) => {
  const hashedPassword = await bcrypt.hash(password, +(process.env.SALT ?? 8));
  const user = await User.findOne({
    $or: [{ name }, { email }],
  });
  if (user) {
    return "failedToSignUp";
  }
  await User.create({ name, password: hashedPassword, email });
};

export type TAuthCheck = {
  success: boolean;
  username?: string;
};

const authCheckService = async (accessToken: string): Promise<TAuthCheck> => {
  const isValid = confirmAccessToken(accessToken);
  if (isValid) {
    return isValid;
  }
  return { success: false };
};

const refreshAccessTokenService = async (username: string) => {
  const user = await User.findOne({ name: username });
  const refresh_token = user?.refresh_token;

  const isValid = confirmRefreshToken(refresh_token ?? "");
  if (isValid && user != null) {
    return generateAccessToken(user);
  }
  return "refresh token is expired";
};



export {
  loginService,
  registerService,
  authCheckService,
  refreshAccessTokenService,
};

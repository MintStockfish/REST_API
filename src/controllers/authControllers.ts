import { Request, Response } from "express";
import {
  loginService,
  registerService,
  authCheckService,
  refreshAccessTokenService,
} from "../services/authService";
import { userSchema } from "../utils/dto";

const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  try {
    const response = await loginService(name, password);
    if (response === "failure") {
      res.json({
        error: "name or password are incorrect",
        message: "failure",
      });
    } else {
      return res.json({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        message: "success",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while login in." });
  }
};

const register = async (req: Request, res: Response) => {
  const { name, password, email } = req.body;
  try {
    const { error, value } = userSchema.validate({ name, password, email }); 

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }

    const response = await registerService(name, password, email);
    if (response === "failedToSignUp") {
      return res
        .status(403)
        .json({ message: "User with this name or email already exists." });
    }
    const token = await loginService(name, password);
    if (token != "failure") {
      return res.status(200).json({
        message: "user successfully registered",
        token: token.access_token,
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "error while signing up." });
  }
};

const authCheck = async (req: Request, res: Response) => {
  const access_token = req.headers["authorization"];
  const username = req.headers["username"];
  try {
    const response = await authCheckService(access_token ?? "string");

    if (response.username) {
      return res
        .status(200)
        .json({ success: true, username: response.username });
    } else {
      return res.status(403).json(response);
    }
  } catch (error: any) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      if (typeof username == "string") {
        const newAccessToken = await refreshAccessTokenService(username);
        if (newAccessToken !== "refresh token is expired") {
          return res.status(200).json({
            message: "access token is expired",
            access_token: newAccessToken,
          });
        }
      }
      return res
        .status(400)
        .json({ message: "JWT token is expired, please log in one more time" });
    }
  }
  return res.status(500).json({ message: "error while checking auth." });
};



export { login, register, authCheck,  };

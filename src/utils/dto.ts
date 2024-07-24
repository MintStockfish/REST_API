import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().description("User name"),
  password: Joi.string().required().description("User password"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "ru", "net", "org", "edu", "gov"] },
    })
    .required()
    .description("User email"),
  purchases: Joi.array()
    .items(Joi.string())
    .default([])
    .description("List of user purchases"),
  refresh_token: Joi.string().description("Refresh token"),
  role: Joi.string().description("User role"),
});

const gameSchema = Joi.object({
  name: Joi.string().required().max(100).description("Game name"),
  genres: Joi.array().items(Joi.string()).required().description("Game genres"),
  platforms: Joi.array()
    .items(Joi.string())
    .required()
    .description("Platforms on which the game is available"),
  releaseYear: Joi.number()
    .integer()
    .positive()
    .min(1800)
    .max(2024)
    .required()
    .description("Game release year"),
  developer: Joi.string().required().description("Game developer"),
});

export { userSchema, gameSchema };

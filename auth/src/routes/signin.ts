import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@washera/common";
import moment from "moment";
import { Password } from "../services/password";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(user.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    let expires = moment().add(7200, "seconds").valueOf();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        exp: expires,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      //jwt: token,
      token,
    };

    res.status(200).send({ user, token, expires });
  }
);

export { router as signinRouter };

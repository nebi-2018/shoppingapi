import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import moment from "moment";
import { validateRequest, BadRequestError } from "@washera/common";

import { User } from "../models/user";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save();

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
      jwt: token,
      //token,
    };

    // new UserCreatedPublisher(natsWrapper.client).publish({
    //   id: user.id,
    //   fullName: user.fullName,
    //   email: user.email,
    //   stripeCustomerId: user.stripeCustomerId,
    // });

    //res.status(201).send(user);
    res.status(201).send({ user, token, expires });
  }
);

export { router as signupRouter };

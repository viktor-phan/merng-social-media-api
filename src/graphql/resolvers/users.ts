import { UserInputError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/User";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../../utils/validators";

const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    "bg4vjg5",
    { expiresIn: "1h" }
  );
};
const userResolvers = {
  Mutation: {
    async register(
      _: any,
      { registerInput: { username, email, password, confirmPassword } }: any
    ) {
      const { valid, err } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      console.log(valid);
      if (!valid) {
        throw new UserInputError("Errors", { err });
      }
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      password = await bcrypt.hash(password, 12);
      console.log(password);
      // const newUser = new User({
      //   email,
      //   username,
      //   password,
      //   createdAt: new Date().toISOString(),
      // });
      const res = await User.create({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      })
      // const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async login(_: any, { username, password }: any) {
      const { err, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { err });
      }
      const user = await User.findOne({ username });

      if (!user) {
        throw new UserInputError("Errors, invalid username or password");
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError("Errors, invalid username or password");
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    
  },
};

export default userResolvers;

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PassThrough } from "stream";

import User from "../../models/User";

const userResolvers = {
  Mutation: {
    async register(
      _: any,
      { registerInput: { username, email, password, confirmPassword } }: any,
      context: any,
      info: any
    ) {
      password = await bcrypt.hash(password, 12);
      console.log(password)
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        "bg4vjg5",
        { expiresIn: "1h" }
      );
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

export default userResolvers;
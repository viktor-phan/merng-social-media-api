import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
const authorize = (context: any) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    if (token) {
      try {
        const user = jwt.verify(token, "bg4vjg5");
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authentication token must be provided");
};

export default authorize;

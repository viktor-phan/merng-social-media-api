import postQuery from "./posts";
import userResolvers from "./users";
const resolvers = {
  Query: {
    ...postQuery.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
export default resolvers;

import postResolver from "./posts";
import userResolvers from "./users";
import commentResolver from "./comments";
const resolvers = {
  Post: {
    likeCount: (parent: any) => parent.likes.length,
    commentCount: (parent: any) => parent.comments.length,
  },
  Query: {
    ...postResolver.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolver.Mutation,
    ...commentResolver.Mutation,
  },
  Subscription: {
    ...postResolver.Subscription,
  },
};
export default resolvers;

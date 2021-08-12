import { Post } from "../../models/Post";
import { AuthenticationError, UserInputError } from "apollo-server";
import authorize from "../../utils/checkauth";

const commentResolver = {
  Mutation: {
    createComment: async (_: any, { postId, body }: any, context: any) => {
      const user = authorize(context) as any;
      //Validate body

      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
    async deleteComment(_: any, { postId, commentId }: any, context: any) {
      const { username } = authorize(context) as any;
      const post = (await Post.findById(postId)) as any;
      if (post) {
        const commentIdx = post.comments.findIndex(
          (c: any) => c.id === commentId
        );
        if (post.comments[commentIdx].username === username) {
          post.comments.splice(commentIdx, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else throw new UserInputError("Post not found");
    },
  },
};
export default commentResolver;

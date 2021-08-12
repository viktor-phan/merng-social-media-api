import { AuthenticationError, UserInputError } from "apollo-server";
import { Post } from "../../models/Post";
import authorize from "../../utils/checkauth";

const postResolver = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        console.log(err);
      }
    },
    async getPost(_: any, { postId }: any) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err: any) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_: any, { body }: any, context: any) {
      const user = authorize(context) as any;
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });
      return post;
    },
    async deletePost(_: any, { postId }: any, context: any) {
      const user = authorize(context) as any;

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Deleted Successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_: any, { postId }: any, context: any) {
      const { username } = authorize(context) as any;

      const post = (await Post.findById(postId)) as any;
      if (post) {
        if (post.likes.find((like: any) => like.username === username)) {
          post.likes = post.likes.filter(
            (like: any) => like.username !== username
          );
          await post.save();
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }
        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_: any, __: any, { pubsub }: any) => {
        pubsub.asyncIterator("NEW_POST");
      },
    },
  },
};
export default postResolver;

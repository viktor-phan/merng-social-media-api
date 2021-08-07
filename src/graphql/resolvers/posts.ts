import { Post } from "../../models/Post";
const postQuery = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
export default postQuery;

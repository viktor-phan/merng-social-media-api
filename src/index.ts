import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import gql from "graphql-tag";

import { Post } from "./models/Post";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
mongoose.connect("mongodb://localhost/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection.on("open", () => {
  console.log("local db is connected");
});
server.listen({ port: 5000 }).then((res) => {
  console.log(`Server is runnig at ${res.url}`);
});

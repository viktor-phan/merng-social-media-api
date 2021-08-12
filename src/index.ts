import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { PubSub } from "graphql-subscriptions";

import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: any) => ({ req, pubsub } as any),
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

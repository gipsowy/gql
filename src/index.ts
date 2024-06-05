import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { returnCompletion } from "./openai-assistant";

const typeDefs = `#graphql
  type Story {
    title: String
    story: String
  }

  type Query {
    stories: [Story]
  }
`;

const resolvers = {
  Query: {
    stories: async () => {
      const completion = await returnCompletion();
      return [completion];
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 6000 },
});

console.log(`🚀  Server ready at: ${url}`);

import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  const gqlSerer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => `Hello, I am graphql server.`,
        say: (_, {name}: {name: string}) => `Hey ${name}, How are you?`
      }
    }
  });

  await gqlSerer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use('/graphql', expressMiddleware(gqlSerer));

  app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
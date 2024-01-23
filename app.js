import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type RootQuery{
        events:[String!]! 
    }
    type RootMutation{
        createEvent(name:String):String
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
    `),
    // resolver
    rootValue: {
      events: () => {
        return ["Ay", "Bee", "Cee", "Dee"];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      },
    },
    // enable graphql playground
    graphiql: true,
  })
);

app.listen(3000);

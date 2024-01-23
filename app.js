import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const app = express();
const events = [];
app.use(bodyParser.json());

// using ! means it cant be null, we can say required
//  input EventInput is a type for create event
app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event{
        _id:ID!
        title:String!
        description : String!
        price:Float!
        date:String!
    }
    input EventInput {
        title:String!
         description:String!
         price:Float!
         date:String!
    }
    type RootQuery{
        events:[Event!]! 
    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
    `),
    // resolver
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random.toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        return events.push(event);
      },
    },
    // enable graphql playground
    graphiql: true,
  })
);

app.listen(3000);

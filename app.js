import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/event.js";

const app = express();
dotenv.config();

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
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            console.log("events fetching error", err);
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log("event.save", result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(" event.save err", err);
            throw err;
          });
      },
    },
    // enable graphql playground
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DBConnection successfull!");
    app.listen(3000);
  })
  .catch((err) => console.log("mongo connection error", err));

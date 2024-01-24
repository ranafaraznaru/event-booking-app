import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

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

    type User{
      _id:ID!
      email:String!
      password:String
    }

    input EventInput {
        title:String!
         description:String!
         price:Float!
         date:String!
    }

    input UserInput {
      email:String!
      password:String
  }

    type RootQuery{
        events:[Event!]! 
    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event
        createUser(userInput:UserInput):User
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
          creator: "65b134bab6688aee55669d6d",
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc };
            return User.findById("65b134bab6688aee55669d6d");
          })
          .then((user) => {
            if (!user) {
              throw new Error("user not found");
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(" event.save err", err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({
          email: args.userInput.email,
        })
          .then((user) => {
            if (user) {
              throw new Error(" user exists already");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null };
          })
          .catch((err) => {
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

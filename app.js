import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { grapphqlSchema } from "./graphql/schema/index.js";
import { rootResolvers } from "./graphql/resolvers/index.js";
import { isAuth } from "./middleware/is_auth.js";

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

//middleware
app.use(isAuth);

// using ! means it cant be null, we can say required
//  input EventInput is a type for create event

app.use(
  "/graphql",
  graphqlHTTP({
    schema: grapphqlSchema,
    // resolver
    rootValue: rootResolvers,
    // enable graphql playground
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DBConnection successfull!");
    app.listen(8000);
  })
  .catch((err) => console.log("mongo connection error", err));

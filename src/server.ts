import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import expressSession from "express-session";
import MongoStore from "connect-mongodb-session";
import AuthRoute from "./Routes/Auth/Auth";
dotenv.config();

const app = express();
const origin = {
  dev: "http://localhost:3000",
  prod: "",
};
//=======================================================MIDDLWARE SETUP================================================
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? origin.prod : origin.dev,
    credentials: true,
  })
);

const store = MongoStore(expressSession);

const mongoURI = process.env.mongoURI;
const mongoStore = new store({
  collection: "usersessions",
  uri: mongoURI,
  expires: 10 * 60 * 60 * 24 * 1000,
});

app.use(
  expressSession({
    name: "_sid",
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      httpOnly: true,
      maxAge: 10 * 60 * 60 * 24 * 1000,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

//==================================================MongoDB Connection & Configs========================================
const connectionOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(mongoURI, connectionOptions, (error) => {
  if (error) {
    return console.error(error);
  }
  console.log("Connection to MongoDB was successful");
});

//==========================================================Server EndPoints============================================
app.use(AuthRoute);

//=================================================Server Configs & Connection==========================================
const PORT = process.env.NODE_ENV || 5000;
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});

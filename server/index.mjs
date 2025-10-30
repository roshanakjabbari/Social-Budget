"use strict";

const PORT = 3000;

import express from "express";
import cors from "cors";
import crypto from "crypto";

function generateSecret(length = 64) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, length); // return required number of characters
}
const secret = generateSecret();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

import session from "express-session";
import passport from "./passport.mjs";

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.authenticate("session"));

import routes from "./routes.mjs";
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});

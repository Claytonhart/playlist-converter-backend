const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const playlists = require("./routes/api/playlists");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

app.get("/", (req, res) => res.send("Hello"));

// Use Routes
app.use("/api/users", users);
app.use("/api/playlists", playlists);

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server running on port ${port}`));

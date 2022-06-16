const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const router = require("./router");
const router_api = require("./router-api");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// static assets
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/fonts", express.static(path.join(__dirname, "public/fonts")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/js", express.static(path.join(__dirname, "public/js")));

app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/admin/"),
  path.join(__dirname, "views/clerk/"),
  path.join(__dirname, "views/user/"),
]);

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", router);
app.use("/api", router_api);

app.listen(port, () => {
  console.log("listening on port " + port);
});

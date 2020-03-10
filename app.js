const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("silog", { title: "|Log/Sign|" });
});

app.get("/home", (req, res) => {
  res.render("index", { title: "|Home|", user: "Guest" });
});

app.listen(port, () => console.log("Server is Running on port: " + port));

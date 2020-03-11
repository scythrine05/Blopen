//REQUIRE OF ALL MODULES

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitized } = require("express-validator/filter");
const mysql = require("mysql");
const session = require("express-session");
// CREATE A CONNECTION

const connection = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "Blopen"
});

//EXPRESS SESSION

const app = express();
app.use(
  session({
    secret: "CoronaVirus",
    resave: true,
    saveUninitialized: true
  })
);
//DATABASE CONNECTED

connection.connect(err => {
  if (err) throw err;
  else console.log("Database Connected!");
});

const port = 5000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//LOCALHOST

app.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("index", { title: "|Home|", user: req.session.user });
  } else {
    res.render("silog", { title: "|Log/Sign|" });
  }
});
//LOGIN

app.post(
  "/login",
  [
    check("Lemail", "Invalid Email")
      .trim()
      .isEmail(),
    check("Lpass", "Password minimum should be 8")
      .trim()
      .isLength({ min: 8 })
  ],
  (req, res) => {
    const errors = validationResult(req);

    console.log(errors.mapped());

    if (!errors.isEmpty()) {
      res.send("NOT LOGINED");
    } else {
      var email = req.body.Lemail;
      var pass = req.body.Lpass;
      if (email && pass) {
        var sql = "SELECT * FROM silog WHERE Email=? AND Password=?";
        connection.query(sql, [email, pass], (error, results, fields) => {
          if (results.length > 0) {
            req.session.loggedin = true;
            req.session.user = results[0].Name;
            res.redirect("/");
          } else {
            res.send("NOT LOGGINED");
          }
          res.end();
        });
      } else {
        res.send("NOT LOGGINED");
      }
    }
  }
);

//SIGN

app.post(
  "/signup",
  [
    check("Semail", "Invalid Email")
      .trim()
      .isEmail(),
    check("Spass", "Password minimum should be 8")
      .trim()
      .isLength({ min: 8 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send("NOT SIGNED");
    } else {
      var sql = "INSERT INTO silog(Name,Password,Email) VALUES(?,?,?)";
      connection.query(
        sql,
        [req.body.Sname, req.body.Spass, req.body.Semail],
        (err, result, fields) => {
          if (err) {
          } else {
            res.render("Profile_pic");
          }
        }
      );
    }
  }
);

app.get("/logout", (req, res) => {
  if (req.session.loggedin) {
    req.session.loggedin = false;
  }
  res.redirect("/");
});

app.listen(port, () => console.log("Server is Running on port: " + port));

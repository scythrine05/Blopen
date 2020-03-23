//REQUIRE OF ALL MODULES

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitized } = require("express-validator/filter");
const mysql = require("mysql");
const ejs = require("ejs");
const session = require("express-session");
const multer = require("multer");
var cookieParser = require("cookie-parser");
// CREATE A CONNECTION

const connection = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "blopen"
});

//CREATE STORAGE FOR PICTURE STORAGE

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

//UPLOAD SECTION

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("myImage");

//CHECK FILETYPE

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|bmp/;
  const extname = filetypes.test(path.extname(file.originalname));

  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    console.log("Images only");
  }
}
//EXPRESS SESSION

const app = express();
app.use(
  session({
    secret: "Coronaiscoming",
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
//USING COOKIE-PARSER
app.use(cookieParser());
//LOCALHOST

app.get("/", (req, res) => {
  var sql2 = "SELECT * FROM catnav ORDER BY TIME(Time) Asc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Query2 not Executed");
      throw err;
    } else {
      console.log("Query2 Executed");
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Home|",
          user: "Welcome ",
          user2: req.session.user, // HOME
          topic: "Home",
          back: "images/body_back.jpg",
          one: "Write ",
          two: "what you can't",
          three: "Say",
          des: "Logout"
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Home|",
          user: "Welcome ",
          user2: " Guest", // HOME
          topic: "Home",
          back: "images/body_back.jpg",
          one: "Write ",
          two: "what you can't",
          three: "Say",
          des: "Log/Sign"
        });
      }
    }
  });
});
//MONTH

var mon = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

var month = new Date().getMonth();

//POST

app.post("/new", (req, res) => {
  var sql1 =
    "INSERT INTO catnav(Id,Heading,Paragraph,Day,Month,Year,Category) values(?,?,?,?,?,?,?)";
  if (req.body.head && req.body.para) {
    connection.query(
      sql1,
      [
        req.session.user,
        req.body.head,
        req.body.para,
        new Date().getDate(),
        mon[month],
        new Date().getFullYear(),
        req.body.category
      ],
      (err, result, field) => {
        if (err) {
          throw err;
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    console.log("Write something");
  }
});
//Account
app.get("/account", (req, res) => {
  if (req.session.loggedin) {
    req.session.loggedin = false;
    res.redirect("/");
  } else {
    res.render("silog", { title: "|Login/Signup|" });
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
    if (!req.session.loggedin) {
      const errors = validationResult(req);

      console.log(errors.mapped());

      if (!errors.isEmpty()) {
        res.render("silog", {
          title: "|Log/Sign|"
        });
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
              res.render("silog", {
                title: "|Log/Sign|"
              });
            }
            res.end();
          });
        } else {
          res.render("silog", {
            title: "|Log/Sign|"
          });
        }
      }
    } else {
      res.redirect("/");
    }
  }
);

//SIGN

app.post(
  "/signup",
  [
    check("Sname", "Max should be 15")
      .trim()
      .isLength({ max: 15 }),
    check("Semail", "Invalid Email")
      .trim()
      .isEmail(),
    check("Spass", "Password minimum should be 8")
      .trim()
      .isLength({ min: 8 }),
    check("Scpass").custom((value, { req }) => {
      if (value != req.body.Spass) {
        res.render("silog", {
          title: "|Log/Sign|"
        });
      } else {
        return true;
      }
    })
  ],
  (req, res) => {
    if (!req.session.loggedin) {
      const errors = validationResult(req);
      console.log(errors.mapped());
      if (!errors.isEmpty()) {
        res.render("silog", {
          title: "|Log/Sign|"
        });
        console.log(errors.mapped());
      } else {
        var sql = "INSERT INTO silog(Name,Password,Email) VALUES(?,?,?)";
        connection.query(
          sql,
          [req.body.Sname, req.body.Spass, req.body.Semail],
          (err, result, fields) => {
            if (err) {
              res.render("silog", {
                title: "|Log/Sign|"
              });
            } else {
              var sql2 = "SELECT * FROM silog WHERE Email=?";

              connection.query(sql2, [req.body.Semail], (error, resu) => {
                if (error) {
                  throw error;
                } else {
                  req.session.loggedin = true;
                  req.session.user = resu[0].Name;
                  req.session.id = resu[0].Id;
                  res.redirect("/");
                }
              });
            }
          }
        );
      }
    } else {
      res.redirect("/");
    }
  }
);
app.get("/upload", (req, res) => {
  res.render("profile", {
    title: "|Profile_Picture|"
  });
});

//POSTING BLOG

app.get("/post", (req, res) => {
  if (req.session.loggedin) {
    res.render("post");
  } else {
    res.redirect("/account");
  }
});

//TRENDING

app.get("/trending", (req, res) => {
  var sql2 = "SELECT * FROM catnav ORDER BY views";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Query2 not Executed");
      throw err;
    } else {
      console.log("Query2 Executed");
      res.render("index", {
        result: result,
        title: "|Trending|",
        user: "",
        user2: "Trending",
        topic: "Trending",
        back: "images/trending.jpg",
        one: "S0 ",
        two: "what's",
        three: "Trending"
      });
    }
  });
});
//MY BLOGS

app.get("/myBlogs", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Id=?";
  if (req.session.loggedin) {
    connection.query(sql2, [req.session.user], (err, result, field) => {
      if (err) {
        console.log("Query2 not Executed");
        throw err;
      } else {
        console.log("Query2 Executed");
        res.render("index", {
          result: result,
          title: "|My_Blogs|",
          user: "Your ",
          user2: "Blogs", // HOME
          topic: "Your blogs",
          back: "images/my_blogs.jpg",
          one: "See ",
          two: "what you ",
          three: "wrote",
          des: "Logout"
        });
      }
    });
  } else {
    res.redirect("/account");
  }
});
//SERVER
app.listen(port, "0.0.0.0", () =>
  console.log("Server is Running on port: " + port)
);

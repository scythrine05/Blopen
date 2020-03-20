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
// CREATE A CONNECTION

const connection = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "Blopen"
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
    res.render("index", {
      title: "|Home|",
      user: "Welcome ",
      user2: req.session.user, // HOME
      topic: "Home",
      back: "images/body_back.jpg",
      one: "Write ",
      two: "what you cant",
      three: "Say"
    });
  } else {
    res.render("silog", {
      title: "|Log/Sign|",
      cross: "images/Empty.png",
      cross2: "images/Empty.png"
    });
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
          title: "|Log/Sign|",
          cross: "images/Empty.png",
          cross2: "images/cross.png"
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
              req.session.id = results[0].Id;
              res.redirect("/");
            } else {
              res.render("silog", {
                title: "|Log/Sign|",
                cross: "images/Empty.png",
                cross2: "images/cross.png"
              });
            }
            res.end();
          });
        } else {
          res.render("silog", {
            title: "|Log/Sign|",
            cross: "images/Empty.png",
            cross2: "images/cross.png"
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
          title: "|Log/Sign|",
          cross: "images/cross.png",
          cross2: "images/Empty.png"
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
          title: "|Log/Sign|",
          cross: "images/cross.png",
          cross2: "images/Empty.png"
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
                title: "|Log/Sign|",
                cross: "images/cross.png",
                cross2: "images/Empty.png"
              });
            } else {
              req.session.user = req.body.Sname;
              req.session.loggedin = true;
              res.redirect("/");
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
app.get("/logout", (req, res) => {
  if (req.session.loggedin) {
    req.session.loggedin = false;
  }
  res.redirect("/");
});
//IMAGE AREA
app.get("/index", (req, res) => {
  req.session.loggedin = true;
  res.render("index");
});

//POSTING BLOG

app.get("/post", (req, res) => {
  res.render("post");
});

//TRENDING

app.get("/trending", (req, res) => {
  res.render("index", {
    title: "|Trending|",
    user: "It is ",
    user2: "Trending", // HOME
    topic: "Trending",
    back: "images/trending.jpg",
    one: "See ",
    two: "what is",
    three: "Trending"
  });
});
//MY BLOGS

app.get("/myBlogs", (req, res) => {
  res.render("index", {
    title: "|My_Blogs|",
    user: "Look at your ",
    user2: "blogs",
    // HOME
    topic: "Your Blogs",
    back: "images/my_blogs.jpg",
    one: "Look ",
    two: "what you ",
    three: "wrote"
  });
});
//SERVER
app.listen(port, "0.0.0.0", () =>
  console.log("Server is Running on port: " + port)
);

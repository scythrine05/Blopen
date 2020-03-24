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
var dialog = require("dialog");
var flash = require("flash-express");
var JSAlert = require("js-alert");

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

const app = express();
app.use(flash());
//EXPRESS SESSION
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
  var sql2 = "SELECT * FROM catnav ORDER BY Time Desc";
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
    res.render("silog", {
      title: "|Login/Signup|",
      msg: "",
      msg2: "",
      msg3: "",
      msg4: ""
    });
  }
});
//LOGIN

app.post("/login", (req, res) => {
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
          title: "|Log/Sign|",
          msg: "Email or Password not Matched",
          msg2: "",
          msg3: "",
          msg4: ""
          //LOGIN EMAIL PASSWORD DOES NOT MATCH
        });
      }
      res.end();
    });
  } else {
    res.render("silog", {
      title: "|Log/Sign|",
      msg: "Fields should not be Empty",
      msg2: "",
      msg3: "",
      msg4: "" // LOGIN FIELD EMPTY
    });
  }
});

//SIGN

app.post(
  "/signup",
  [
    check("Sname", " Username max should be 15")
      .trim()
      .isLength({ max: 15 }),
    check("Semail", "Invalid Email")
      .trim()
      .isEmail(),
    check("Spass", "Password min should be 8")
      .trim()
      .isLength({ min: 8 }),
    check("Scpass", "Confirm Password not matched").custom(
      (value, { req, res }) => {
        if (value != req.body.Spass) {
        } else {
          return true;
        }
      }
    )
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors.mapped());
    if (!errors.isEmpty()) {
      res.render("silog", {
        title: "|Log/Sign|",
        msg: "",
        msg2: errors.mapped(),
        msg3: "",
        msg4: "" // ERRORS IN VALIDARTION SIGN
      });
      console.log(errors.mapped().msg);
    } else {
      var sq = "SELECT * FROM silog WHERE Name=?";
      connection.query(sq, [req.body.Sname], (e, r) => {
        if (r.length > 0) {
          res.render("silog", {
            title: "|Log/Sign|",
            msg: "",
            msg2: "",
            msg3: "Username Already Exist",
            msg4: "" // USERNAME ALREADY EXIST
          });
          console.log("Username already Exist");
        } else {
          var sql = "INSERT INTO silog(Name,Password,Email) VALUES(?,?,?)";
          connection.query(
            sql,
            [req.body.Sname, req.body.Spass, req.body.Semail],
            (err, result, fields) => {
              if (err) {
                res.render("silog", {
                  title: "|Log/Sign|" //ERROR IN DATABASE INSERTION
                });
                console.log("Error in Insertion");
              } else {
                var sql2 = "SELECT * FROM silog WHERE Email=?";

                connection.query(sql2, [req.body.Semail], (error, resu) => {
                  if (error) {
                    throw error; //ERROR IN FINDING EMAIL
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
      });
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
    res.render("post", { des: "Logout" });
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
  var sql2 = "SELECT * FROM catnav WHERE Id=? ORDER BY Time Desc";
  if (req.session.loggedin) {
    connection.query(sql2, [req.session.user], (err, result, field) => {
      if (err) {
        console.log("Query2 not Executed");
        throw err;
      } else {
        console.log("Query2 Executed");
        res.render("my", {
          result: result,
          title: "|My_Blogs|",
          user: "My ",
          user2: "Blogs",
          topic: "Your blogs",
          back: "images/my_blogs.jpg",
          one: " Let's See ",
          two: "what I ",
          three: "wrote",
          des: "Logout"
        });
      }
    });
  } else {
    res.redirect("/account");
  }
});
//FULL BLOG VIEW
app.get("/blog/:BId?", (req, res) => {
  var sql = "SELECT * FROM catnav WHERE BId=?";
  connection.query(sql, [req.params.BId], (err, result) => {
    if (err) {
      console.log("No such blog found");
      res.redirect("/myBlogs");
    } else {
      if (req.session.loggedin) {
        res.render("blogs", {
          result: result,
          title: "|Blogs|",
          des: "Logout"
        });
      } else {
        res.render("blogs", {
          result: result,
          title: "|Blogs|",
          des: "Log/Sign"
        });
      }
    }
  });
});
//DELETE THE BLOG

app.get("/delete/:BId?", (req, res) => {
  var sql = "SELECT * FROM catnav WHERE BId=?";
  if (req.session.loggedin) {
    connection.query(sql, [req.params.BId], (err, result) => {
      console.log(req.session.user + " " + result[0].Id);
      if (err) {
        res.send("Blog Dosen't Exisit");
      } else {
        if (req.session.user == result[0].Id) {
          var sql2 = "DELETE FROM catnav WHERE BId=?";
          connection.query(sql2, [req.params.BId], er => {
            if (er) {
              res.send("Blog Dosen't Exisit");
            } else {
              res.redirect("/myBlogs");
            }
          });
        } else {
          res.send("You are Unauthorized here");
        }
      }
    });
  } else {
    res.send("You are Unauthorized here");
  }
});

//EDIT THE BLOG

app.get("/edit/:BId?", (req, res) => {
  var sql = "SELECT * FROM catnav WHERE BId=?";
  if (req.session.loggedin) {
    connection.query(sql, [req.params.BId], (err, result) => {
      console.log(req.session.user + " " + result[0].Id);
      if (err) {
        res.send("Blog Dosen't Exisit");
      } else {
        if (req.session.user == result[0].Id) {
          res.render("edit", { des: "Logout", result: result });
        } else {
          res.send("You are Unauthorized here");
        }
      }
    });
  } else {
    res.send("You are Unauthorized here");
  }
});

//UPDATE THE BLOG

app.post("/edited/:BId?", (req, res) => {
  var sql = "SELECT * FROM catnav WHERE BId=?";
  if (req.session.loggedin) {
    connection.query(sql, [req.params.BId], (err, result) => {
      console.log(req.session.user + " " + result[0].Id);
      if (err) {
        res.send("Blog Dosen't Exisit");
      } else {
        if (req.session.user == result[0].Id) {
          var sql2 =
            "UPDATE catnav SET Heading=?,Paragraph=?,Category=? WHERE Bid=?";
          connection.query(
            sql2,
            [req.body.head, req.body.para, req.body.category, req.params.BId],
            e => {
              if (e) {
                res.send("Something went wrong");
              } else {
                res.redirect("/myBlogs");
              }
            }
          );
        } else {
          res.send("You are Unauthorized here");
        }
      }
    });
  } else {
    res.send("You are Unauthorized here");
  }
});

//SERVER
app.listen(port, "0.0.0.0", () =>
  console.log("Server is Running on port: " + port)
);

//REQUIRE OF ALL MODULES

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const { matchedData, sanitized } = require("express-validator");
const mysql = require("mysql");
const ejs = require("ejs");
const session = require("express-session");
const multer = require("multer");
const nodemailer = require("nodemailer");
var inf;

// CREATE A CONNECTION
//b30de768ff88d7:9a431b69@us-cdbr-iron-east-01.cleardb.net/heroku_18b0797700c12ad?reconnect=true

var connection = mysql.createPool({
  host: "us-cdbr-iron-east-01.cleardb.net",
  password: "9a431b69",
  user: "b30de768ff88d7",
  database: "heroku_18b0797700c12ad",
  multipleStatements: true
});

//CREATE TRANSPORTER FOR NODEMAILER

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "blopen.blogger@gmail.com",
    pass: "rohanmessibuddy"
  }
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
    cb("Images Only");
  }
}

const app = express();
//EXPRESS SESSION
app.use(
  session({
    secret: "Coronaiscoming",
    resave: true,
    saveUninitialized: true
  })
);
//DATABASE CONNECTED

connection.getConnection(err => {
  if (err) throw err;
  else console.log("Database Connected!");
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
//LOCALHOST

app.get("/", (req, res) => {
  var sql2 = "SELECT * FROM catnav ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in index can't select from Catnav");
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Home|",
          user: "Welcome ",
          user2: req.session.user, // HOME
          back: "/images/body_back.jpg",
          one: "Write ",
          two: "what you can't",
          three: "Say",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Home|",
          user: "Welcome ",
          user2: " Guest", // HOME
          back: "/images/body_back.jpg",
          one: "Write ",
          two: "what you can't",
          three: "Say",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});
//CATEGORY

//FASHION
app.get("/category/fashion", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Category=0 ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in Fashion can't select from Catnav");
      throw err;
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Fashion|",
          user: "Fashion ",
          user2: "World", // HOME
          back: "/images/fashion2.jpg",
          one: "Let's ",
          two: "Dress ",
          three: "Up",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Fashion|",
          user: "Fashion ",
          user2: " World", // HOME
          back: "/images/fashion2.jpg",
          one: "Let's ",
          two: "Dress ",
          three: "Up",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});
//FOOD
app.get("/category/food", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Category=2 ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in Food can't select from Catnav");
      throw err;
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Food|",
          user: "Be A ",
          user2: "Foodie", // HOME
          back: "/images/food2.jpg",
          one: "Let's ",
          two: "Eat Some ",
          three: "Stuff",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Food|",
          user: "Be A ",
          user2: "Foodie",
          back: "/images/food2.jpg",
          one: "Let's ",
          two: "Eat Some ",
          three: "Stuff",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});
//ENTERTAINMENT
app.get("/category/entertainment", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Category=3 ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in Entertainment can't select from Catnav");
      throw err;
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Entertainment|",
          user: "Movie ",
          user2: "Time ", // HOME
          back: "/images/entertainment2.jpg",
          one: "Make ",
          two: "Your Life ",
          three: "Entertaining",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Entertainment|",
          user: "Movie ",
          user2: "Time ",
          back: "/images/entertainment2.jpg",
          one: "Make ",
          two: "Your Life ",
          three: "Entertaining",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});
//COMMERCE
app.get("/category/commerce", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Category=4 ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in Commerce can't select from Catnav");
      throw err;
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|COMMERCE|",
          user: "Make ",
          user2: "Money", // HOME
          back: "/images/commerce2.jpg",
          one: "Give ",
          two: "Yourself A ",
          three: "Piechart",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|COMMERCE|",
          user: "Make ",
          user2: "Money",
          back: "/images/commerce2.jpg",
          one: "Give ",
          two: "Yourself A ",
          three: "Piechart",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});
//TRAVEL
app.get("/category/travel", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Category=1 ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in Travel can't select from Catnav");
      throw err;
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Travel|",
          user: "Go ",
          user2: "Travel", // HOME
          back: "/images/travel2.jpg",
          one: "Don't ",
          two: "Stop Just ",
          three: "Travel",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Travel|",
          user: "Go ",
          user2: "Travel",
          back: "/images/travel2.jpg",
          one: "Don't ",
          two: "Stop Just ",
          three: "Travel",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});
//SCIENCE AND TECHNOLOGY
app.get("/category/science", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Category=5 ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in Sci/Tech can't select from Catnav");
      throw err;
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Science and Technology|",
          user: "Man It's ",
          user2: "Science", // HOME
          back: "/images/science2.jpg",
          one: "How  ",
          two: "Much you scored in",
          three: "Science",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Science and Technology|",
          user: "Man It's ",
          user2: "Science",
          back: "/images/science2.jpg",
          one: "How  ",
          two: "Much you scored in",
          three: "Science",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});

//OTHERS

app.get("/category/others", (req, res) => {
  var sql2 = "SELECT * FROM catnav WHERE Category=6 ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Error in Others can't select from Catnav");
      throw err;
    } else {
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Others|",
          user: "Something ",
          user2: "Different", // HOME
          back: "/images/boxes2.jpg",
          one: "Let's ",
          two: "Explore",
          three: "Something New",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Others|",
          user: "Something ",
          user2: "Different",
          back: "/images/boxes2.jpg",
          one: "Let's ",
          two: "Explore",
          three: "Something New",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
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
    "INSERT INTO catnav(Id,Heading,Paragraph,Day,Month,Year,Category,Img) values(?,?,?,?,?,?,?,?)";
  if (req.body.head && req.body.para && req.body.category) {
    connection.query(
      sql1,
      [
        req.session.user,
        req.body.head,
        req.body.para,
        new Date().getDate(),
        mon[month],
        new Date().getFullYear(),
        req.body.category,
        req.session.pic
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
    res.render("post", {
      des: "Logout",
      warn: "Fields should no be Empty",
      file: `/images/uploaded/${req.session.pic}`
    });
  }
});
//Account
app.get("/account", (req, res) => {
  if (req.session.loggedin) {
    req.session.loggedin = false;
    req.session.pic = "";
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
        req.session.email = results[0].Email;
        req.session.pic = results[0].Image;
        console.log(req.session.pic);
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
    check("Sname", " Username maximum should be 15")
      .trim()
      .isLength({ max: 15 }),
    check("Semail", "Invalid Email")
      .trim()
      .isEmail(),
    check("Spass", "Password minimum should be 8")
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
      var sq = "SELECT * FROM silog WHERE Name=? OR Email=?";
      connection.query(sq, [req.body.Sname, req.body.Semail], (e, r) => {
        if (r.length > 0) {
          if (r[0].Email === req.body.Semail) {
            res.render("silog", {
              title: "|Log/Sign|",
              msg: "",
              msg2: "",
              msg3: "Account Already Exist",
              msg4: "" // ACCOUNT ALREADY EXIST
            });
          } else if (r[0].Name.toUpperCase() === req.body.Sname.toUpperCase()) {
            res.render("silog", {
              title: "|Log/Sign|",
              msg: "",
              msg2: "",
              msg3: "Username Already Exist",
              msg4: "" // USERNAME ALREADY EXIST
            });
          }
        } else {
          var mail = {
            from: "blopen.blogger@gmail.com",
            to: req.body.Semail,
            subject: "Blopen: Email Verification",
            html:
              "<h2>Thank you for joining Blopen, We'll hope you will enjoy using it </h2><br/><h4> Your Code:  " +
              "@$123" +
              req.body.Sname +
              "%66" +
              "</h4>"
          };

          transport.sendMail(mail, (ee, info) => {
            if (ee) {
              res.render("silog", {
                title: "|Log/Sign|",
                msg: "",
                msg2: "",
                msg3: "Invalid Email",
                msg4: ""
              });
            } else {
              inf = [
                req.body.Semail,
                req.body.Spass,
                req.body.Sname,
                "@$123" + req.body.Sname + "%66"
              ];
              res.redirect("/Verify_mail");
            }
          });
        }
      });
    }
  }
);

//POSTING BLOG

app.get("/post", (req, res) => {
  if (req.session.loggedin) {
    res.render("post", {
      des: "Logout",
      warn: "",
      file: `/images/uploaded/${req.session.pic}`
    });
  } else {
    res.redirect("/account");
  }
});

//TRENDING

app.get("/trending", (req, res) => {
  var sql2 = "SELECT * FROM catnav ORDER BY views DESC,Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Query2 not Executed");
      throw err;
    } else {
      console.log("Query2 Executed");
      if (req.session.loggedin) {
        res.render("index", {
          result: result,
          title: "|Trending|",
          user: "",
          user2: "Trending",
          topic: "Trending",
          back: "images/trending.jpg",
          one: "S0 ",
          two: "what's",
          three: "Trending",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("index", {
          result: result,
          title: "|Trending|",
          user: "",
          user2: "Trending",
          topic: "Trending",
          back: "images/trending.jpg",
          one: "S0 ",
          two: "what's",
          three: "Trending",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
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
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    });
  } else {
    res.redirect("/account");
  }
});
//FULL BLOG VIEW
app.get("/blog/:Bid?", (req, res) => {
  var sql = "SELECT * FROM catnav WHERE Bid=?";
  connection.query(sql, [req.params.Bid], (err, result) => {
    if (err) {
      console.log("No such blog found");
      res.redirect("/myBlogs");
    } else {
      var v = result[0].views;
      v = v + 1;
      connection.query("UPDATE catnav SET views=? WHERE Bid=?", [
        v,
        req.params.Bid
      ]);
      if (req.session.loggedin) {
        switch (result[0].Category) {
          case 0:
            {
              res.render("blogs", {
                result: result,
                title: "|Fashion Blog|",
                des: "Logout",
                back: "/images/fashion3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;
          case 1:
            {
              res.render("blogs", {
                result: result,
                title: "| Travel Blog|",
                des: "Logout",
                back: "/images/travel3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;
          case 2:
            {
              res.render("blogs", {
                result: result,
                title: "|Food Blog|",
                des: "Logout",
                back: "/images/food3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }

            break;

          case 3:
            {
              res.render("blogs", {
                result: result,
                title: "|Entertainment Blog|",
                des: "Logout",
                back: "/images/entertainment3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;

          case 4:
            {
              res.render("blogs", {
                result: result,
                title: "|Bussiness Blog|",
                des: "Logout",
                back: "/images/commerce3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;

          case 5:
            {
              res.render("blogs", {
                result: result,
                title: "|Science Blog|",
                des: "Logout",
                back: "/images/science3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;

          default: {
            res.render("blogs", {
              result: result,
              title: "|Blog|",
              des: "Logout",
              back: "/images/test.jpg",
              file: `/images/uploaded/${req.session.pic}`
            });
          }
        }
      } else {
        switch (result[0].Category) {
          case 0:
            {
              res.render("blogs", {
                result: result,
                title: "|Fashion Blog|",
                des: "Log/Sign",
                back: "/images/fashion3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;
          case 1:
            {
              res.render("blogs", {
                result: result,
                title: "|Travel Blog|",
                des: "Log/Sign",
                back: "/images/travel3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;
          case 2:
            {
              res.render("blogs", {
                result: result,
                title: "|Food Blog|",
                des: "Log/Sign",
                back: "/images/food3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }

            break;

          case 3:
            {
              res.render("blogs", {
                result: result,
                title: "|Entertainment Blog|",
                des: "Log/Sign",
                back: "/images/entertainment3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;

          case 4:
            {
              res.render("blogs", {
                result: result,
                title: "|Bussiness Blog|",
                des: "Log/Sign",
                back: "/images/commerce3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;

          case 5:
            {
              res.render("blogs", {
                result: result,
                title: "|Science Blog|",
                des: "Log/Sign",
                back: "/images/science3.jpg",
                file: `/images/uploaded/${req.session.pic}`
              });
            }
            break;

          default: {
            res.render("blogs", {
              result: result,
              title: "|Blog|",
              des: "Log/Sign",
              back: "/images/test.jpg",
              file: `/images/uploaded/${req.session.pic}`
            });
          }
        }
      }
    }
  });
});
//DELETE THE BLOG
app.get("/delete/:Bid?", (req, res) => {
  var x = req.params.Bid;
  if (req.session.loggedin) {
    var sql = "SELECT * FROM catnav WHERE Bid=?";

    connection.query(sql, [x], (e, r) => {
      if (r[0].Id.toUpperCase() == req.session.user.toUpperCase()) {
        if (req.session.loggedin) {
          res.render("del_blog", { error: "", x: x });
        } else {
          res.redirect("/");
        }
      } else {
        res.send("You are not authorised");
      }
    });
  } else {
    res.send("You are not authorized here");
  }
});

app.post("/delete/:Bid?", (req, res) => {
  var y = req.params.Bid;
  console.log(y);
  var sql3 = "SELECT * FROM silog WHERE Name=?";
  connection.query(sql3, [req.session.user], (e, r) => {
    if (e) {
      res.send("User doesn't Exist");
    } else {
      if (req.body.password == r[0].Password) {
        console.log("1");
        var sql2 = "DELETE FROM catnav WHERE Bid=?";
        connection.query(sql2, [y], er => {
          console.log("2");
          if (er) {
            res.send("Blog Dosen't Exisit");
          } else {
            res.redirect("/myBlogs");
          }
        });
      } else {
        res.render("del_blog", { error: "Incorrect Password", x: y });
      }
    }
  });
});
//CATEGORY

app.get("/category", (req, res) => {
  var sql2 = "SELECT * FROM catnav ORDER BY Time Desc";
  connection.query(sql2, (err, result, field) => {
    if (err) {
      console.log("Query2 not Executed");
      throw err;
    } else {
      console.log("Query2 Executed");
      if (req.session.loggedin) {
        res.render("category", {
          result: result,
          title: "|Category|",
          user: "Welcome ",
          user2: req.session.user,
          topic: "Home",
          back: "images/body_back.jpg",
          one: "Write ",
          two: "what you can't",
          three: "Say",
          des: "Logout",
          file: `/images/uploaded/${req.session.pic}`
        });
      } else {
        res.render("category", {
          result: result,
          title: "|Category|",
          user: "Welcome ",
          user2: " Guest",
          topic: "Home",
          back: "images/body_back.jpg",
          one: "Write ",
          two: "what you can't",
          three: "Say",
          des: "Log/Sign",
          file: `/images/uploaded/${req.session.pic}`
        });
      }
    }
  });
});

//EDIT THE BLOG

app.get("/edit/:Bid?", (req, res) => {
  var sql = "SELECT * FROM catnav WHERE Bid=?";
  if (req.session.loggedin) {
    connection.query(sql, [req.params.Bid], (err, result) => {
      console.log(req.session.user + " " + result[0].Id);
      if (err) {
        res.send("Blog Dosen't Exisit");
      } else {
        if (req.session.user == result[0].Id) {
          res.render("edit", {
            des: "Logout",
            result: result,
            warn: "",
            file: `/images/uploaded/${req.session.pic}`
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

//UPDATE THE BLOG

app.post("/edited/:Bid?", (req, res) => {
  var sql = "SELECT * FROM catnav WHERE Bid=?";
  var sql2 = "UPDATE catnav SET Heading=?,Paragraph=?,Category=? WHERE Bid=?";
  if (req.session.loggedin) {
    connection.query(sql, [req.params.Bid], (err, result) => {
      if (err) {
        res.send("Blog Dosen't Exisit");
      } else {
        if (req.body.head && req.body.para && req.body.category) {
          connection.query(
            sql2,
            [req.body.head, req.body.para, req.body.category, req.params.Bid],
            e => {
              if (e) {
                res.send("Something went wrong");
              } else {
                res.redirect("/myBlogs");
              }
            }
          );
        } else {
          res.render("edit", {
            des: "Logout",
            result: result,
            warn: "Fields Should not be empty",
            file: `/images/uploaded/${req.session.pic}`
          });
        }
      }
    });
  } else {
    res.send("You are Unauthorized here");
  }
});
//PROFILE

app.get("/profile", (req, res) => {
  if (req.session.loggedin) {
    var sql = "SELECT * FROM catnav WHERE Id= ?";
    connection.query(sql, [req.session.user], (err, result) => {
      req.session.count = result.length;
      res.render("profile", {
        title: "|Profile|",
        des: "Logout",
        user: req.session.user,
        email: req.session.email,
        num: result.length,
        file: `/images/uploaded/${req.session.pic}`,
        msg: ""
      });
    });
  } else {
    res.redirect("/account");
  }
});
//PICTURE UPLOAD SECTION
app.post("/upload_pic", (req, res) => {
  upload(req, res, err => {
    var sql = "UPDATE silog SET Image=? WHERE Name=?";
    var sql2 = "UPDATE catnav SET Img=? WHERE Id=?";

    if (err) {
      res.render("profile", {
        title: "|Profile|",
        des: "Logout",
        user: req.session.user,
        email: req.session.email,
        num: req.session.count,
        file: `/images/uploaded/${req.session.pic}`,
        msg: err
      });
    } else {
      connection.query(sql, [req.file.filename, req.session.user], er => {
        connection.query(sql2, [req.file.filename, req.session.user], e => {
          req.session.pic = req.file.filename;
          res.render("profile", {
            title: "|Profile|",
            des: "Logout",
            user: req.session.user,
            email: req.session.email,
            num: req.session.count,
            file: `/images/uploaded/${req.session.pic}`,
            msg: ""
          });
        });
      });
    }
  });
});

//DELETE ACCOUNT

app.get("/del_account", (req, res) => {
  if (req.session.user) {
    res.render("del", { error: "" });
  } else {
    res.send("You are not Authorised here");
  }
});
app.post("/del_account", (req, res) => {
  var sqll = "SELECT * FROM silog WHERE Name= ? ";
  var sql = "DELETE FROM silog WHERE Name=?";

  connection.query(sqll, req.session.user, (e, result) => {
    if (req.body.password == result[0].Password) {
      connection.query(sql, req.session.user, err => {
        if (err) {
          res.send("Something went wrong");
        } else {
          req.session.loggedin = false;
          req.session.pic = "";
          res.redirect("/");
        }
      });
    } else {
      res.render("del", { error: "Incorrect Password" });
    }
  });
});

//SIGN THROUGH MAIL

app.get("/Verify_mail", (req, res) => {
  res.render("confirm_email", { error: "" });
});
app.post("/verified", (req, res) => {
  if (req.body.text == inf[3]) {
    var sql = "INSERT INTO silog(Name,Password,Email) VALUES(?,?,?)";
    connection.query(sql, [inf[2], inf[1], inf[0]], (err, result, fields) => {
      if (err) {
        res.render("silog", {
          title: "|Log/Sign|" //ERROR IN DATABASE INSERTION
        });
        console.log("Error in Insertion");
      } else {
        var sql2 = "SELECT * FROM silog WHERE Email=?";

        connection.query(sql2, [inf[0]], (error, resu) => {
          if (error) {
            throw error; //ERROR IN FINDING EMAIL
          } else {
            req.session.loggedin = true;
            req.session.user = resu[0].Name;
            req.session.id = resu[0].Id;
            req.session.email = resu[0].Email;
            req.session.Image = resu[0].Image;
            res.redirect("/");
          }
        });
      }
    });
  } else {
    res.render("confirm_email", { error: "Invalid Code" });
  }
});

//SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

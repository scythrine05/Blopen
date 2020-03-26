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
          des: "Logout"
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
          des: "Log/Sign"
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
          des: "Logout"
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
          des: "Log/Sign"
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
          des: "Logout"
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
          des: "Log/Sign"
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
          des: "Logout"
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
          des: "Log/Sign"
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
          des: "Logout"
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
          des: "Log/Sign"
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
          des: "Logout"
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
          des: "Log/Sign"
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
          des: "Logout"
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
          des: "Log/Sign"
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
          des: "Logout"
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
    res.render("post", { des: "Logout", warn: "Fields should no be Empty" });
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
        req.session.email = results[0].Email;
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
                    req.session.email = resu[0].Email;
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
    res.render("post", { des: "Logout", warn: "" });
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
          des: "Logout"
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
          des: "Log/Sign"
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
      var v = result[0].views;
      v = v + 1;
      connection.query("UPDATE catnav SET views=? WHERE BId=?", [
        v,
        req.params.BId
      ]);
      if (req.session.loggedin) {
        switch (result[0].Category) {
          case 0:
            {
              res.render("blogs", {
                result: result,
                title: "|Fashion Blog|",
                des: "Logout",
                back: "/images/fashion3.jpg"
              });
            }
            break;
          case 1:
            {
              res.render("blogs", {
                result: result,
                title: "| Travel Blog|",
                des: "Logout",
                back: "/images/travel3.jpg"
              });
            }
            break;
          case 2:
            {
              res.render("blogs", {
                result: result,
                title: "|Food Blog|",
                des: "Logout",
                back: "/images/food3.jpg"
              });
            }

            break;

          case 3:
            {
              res.render("blogs", {
                result: result,
                title: "|Entertainment Blog|",
                des: "Logout",
                back: "/images/entertainment3.jpg"
              });
            }
            break;

          case 4:
            {
              res.render("blogs", {
                result: result,
                title: "|Bussiness Blog|",
                des: "Logout",
                back: "/images/commerce3.jpg"
              });
            }
            break;

          case 5:
            {
              res.render("blogs", {
                result: result,
                title: "|Science Blog|",
                des: "Logout",
                back: "/images/science3.jpg"
              });
            }
            break;

          default: {
            res.render("blogs", {
              result: result,
              title: "|Blog|",
              des: "Logout",
              back: "/images/blogs.jpg"
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
                back: "/images/fashion3.jpg"
              });
            }
            break;
          case 1:
            {
              res.render("blogs", {
                result: result,
                title: "|Travel Blog|",
                des: "Log/Sign",
                back: "/images/travel3.jpg"
              });
            }
            break;
          case 2:
            {
              res.render("blogs", {
                result: result,
                title: "|Food Blog|",
                des: "Log/Sign",
                back: "/images/food3.jpg"
              });
            }

            break;

          case 3:
            {
              res.render("blogs", {
                result: result,
                title: "|Entertainment Blog|",
                des: "Log/Sign",
                back: "/images/entertainment3.jpg"
              });
            }
            break;

          case 4:
            {
              res.render("blogs", {
                result: result,
                title: "|Bussiness Blog|",
                des: "Log/Sign",
                back: "/images/commerce3.jpg"
              });
            }
            break;

          case 5:
            {
              res.render("blogs", {
                result: result,
                title: "|Science Blog|",
                des: "Log/Sign",
                back: "/images/science3.jpg"
              });
            }
            break;

          default: {
            res.render("blogs", {
              result: result,
              title: "|Blog|",
              des: "Log/Sign",
              back: "/images/blogs.jpg"
            });
          }
        }
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
          title: "|Home|",
          user: "Welcome ",
          user2: req.session.user,
          topic: "Home",
          back: "images/body_back.jpg",
          one: "Write ",
          two: "what you can't",
          three: "Say",
          des: "Logout"
        });
      } else {
        res.render("category", {
          result: result,
          title: "|Home|",
          user: "Welcome ",
          user2: " Guest",
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
          res.render("edit", { des: "Logout", result: result, warn: "" });
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
          if (req.body.head && req.body.para && req.body.category) {
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
            res.render("edit", {
              des: "Logout",
              result: result,
              warn: "Fields Should not be empty"
            });
          }
        } else {
          res.send("You are Unauthorized here");
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
      res.render("profile", {
        title: "|Profile|",
        des: "Logout",
        user: req.session.user,
        email: req.session.email,
        num: result.length
      });
    });
  } else {
    res.redirect("/account");
  }
});

//SERVER
app.listen(port, "0.0.0.0", () =>
  console.log("Server is Running on port: " + port)
);

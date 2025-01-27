const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//reuire route path
const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//basic code to connect a databases
// const MONGO_URL = "mongodb://127.0.0.1:27017/stayaway";
const MONGO_URL =
  "mongodb+srv://vishalMaurya:pGbZc09TfmHPP8uw@vishu.js2ya.mongodb.net/staway?retryWrites=true&w=majority&appName=vishupGbZc09TfmHPP8uw";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

//for home page
app.get("/", (req, res) => {
  res.send("hii.. i'm here");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

//for cookie response
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

//user signup and login.  this is passport package
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash to show msg
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //for update ,edit ,new listings & review
  res.locals.success1 = req.flash("success1"); //for delete listings and review
  res.locals.success2 = req.flash("success2"); //after login signup status
  res.locals.error = req.flash("error"); //for handling invalid path access
  res.locals.error1 = req.flash("error1");
  res.locals.currUser = req.user;
  next();
});

app.get("/home", (req, res) => {
  res.render("listings/home.ejs");
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "vishu@gmail.com",
    username: "vishu",
  });

  let registeredUser = await User.register(fakeUser, "vishu");
  res.send(registeredUser);
});

//calling  routers
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//error handling
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

//localhost
let PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
  console.log(`Server is listing on ${PORT} `);
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         category: 'villa',
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });

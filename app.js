const path = require("path");
const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// Error handling
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const authController = require("./controllers/authController");

// Passport config
authController.passportConfig(passport);

const app = express();

// Sessions
app.use(
  session({
    secret: "Something very secretive",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  })
);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

//  SET HTTP HEADERS
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// DEV LOG
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// LIMIT API REQUESTS FROM AN IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, Please try again in an hour!",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// DATA SANITIZATION against NOSQL Query Injection
app.use(mongoSanitize());

// DATA SANITIZATION against XXS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp());

app.use(compression());

// MOUNTING ROUTERS
app.use((req, res, next) => {
  if (req.user) {
    res.locals.userID = req.user._id;
  }
  next();
});
app.use("/", require("./routes/viewRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/v1/stores", require("./routes/storeRoutes"));
app.use("/api/v1/products", require("./routes/productRoutes"));

// Errors
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/userModel");
const Store = require("../models/storeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//  emails: [{ value: "ascondaa@gmail.com", verified: true }]
exports.passportConfig = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};

exports.renderLogin = (req, res) => res.status(200).render("login");

exports.renderStoreOrForm = catchAsync(async (req, res, next) => {
  const store = await Store.findOne({ storeOwner: req.user.id });

  if (!store) return res.redirect("/create-store");

  res.redirect(`/${store.slug}/dashboard`);
});

exports.limitToUsers = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Please login to access this page", 400));
  }

  next();
};

exports.limitToStoreOwners = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Please login to access this page", 400));
  }

  const store = await Store.findOne({ storeOwner: req.user.id });

  if (!store) {
    return next(new AppError("Sorry. You do not have access this page", 400));
  }
  next();
});

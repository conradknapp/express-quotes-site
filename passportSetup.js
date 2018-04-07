const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./configKeys');
const User = mongoose.model('users');

module.exports = {
  configPassport: (passport) => {
    passport.use(
      new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
      }, (accessToken, refreshToken, profile, done) => {
        const userImgSmall = profile.photos[0].value;
        const qMark = userImgSmall.indexOf('?');
        const userImg = userImgSmall.substring(0, qMark);
        
        const newUser = {
          googleID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: userImg
        };
  
        User.findOne({
          googleID: profile.id
        })
        .then(user => {
          if (user) {
            done(null, user)
          } else {
            new User(newUser)
              .save()
              .then(user => done(null, user));
          }
        })
      })
    );
  
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
  
    passport.deserializeUser((id, done) => {
      User.findById(id).then(user => done(null, user));
    });
  }
}

// module.exports = (passport) => {
//   passport.use(
//     new GoogleStrategy({
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       callbackURL: '/auth/google/callback',
//       proxy: true
//     }, (accessToken, refreshToken, profile, done) => {
//       const userImgSmall = profile.photos[0].value;
//       const qMark = userImgSmall.indexOf('?');
//       const userImg = userImgSmall.substring(0, qMark);
      
//       const newUser = {
//         googleID: profile.id,
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         email: profile.emails[0].value,
//         image: userImg
//       };

//       User.findOne({
//         googleID: profile.id
//       })
//       .then(user => {
//         if (user) {
//           done(null, user)
//         } else {
//           new User(newUser)
//             .save()
//             .then(user => done(null, user));
//         }
//       })
//     })
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     User.findById(id).then(user => done(null, user));
//   });
// }
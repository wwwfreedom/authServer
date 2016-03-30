const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  // sub is jwt convention for subject. Basically saying who's this token about, who it belong to.
  // iat is another convention of jwt stands issue at time
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password authenticated
  // we just need to give them a token
  // req.user is pass in from the passport local middleware strategy as part of returning done(null, user) in the passport.js
  res.send({token: tokenForUser(req.user)})
}

exports.signup = function (req, res, next) {

  // anything contain in this poss request
  // req.body
  // lesson: because we enforce all email as lowercase in our user model we have to make sure the email we parse is also lowercase as well other wise it will never find email in the database
  const email = req.body.email
  const password = req.body.password

  // this is where you do server side validation user validator.js
  if (!email || !password) {
    return res.status(422).send({error: 'You must provide email and password'})
  }

  const emailLowerCase = email.toLowerCase()
  // see if a user with the given email exists
  // User here is a class of users, the entire collection of users save in db
  User.findOne({ email: emailLowerCase }, (err, existingUser) => {
    if (err) { return next(err); }
    // If a user with email does exist , return an error
    if (existingUser) {
      // 422 means unprocess entities the data client provide is bad
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    })
    // to actually save the user into db
    user.save((err) => {
      if (err) { return next(err); }
      // respond to request indicating the user was created
      res.json({token: tokenForUser(user)});
    });
    // Respond to request indicating the user was created
  })
}
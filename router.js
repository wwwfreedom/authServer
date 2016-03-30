const Authentication = require('./controllers/authentication.js')
const passportService = require('./services/passport.js')
const passport = require('passport')

// session false stop passport from defaulting to creating a cookie because we're using jwt
const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  app.get('/', requireAuth, function (req, res) {
    res.send({hi: 'there'})
  })
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
}
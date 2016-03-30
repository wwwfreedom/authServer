const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  // lesson don't have to assign user to this if we use arrow function for the rest of the code however the first function must not be an arrow function. the reason is arrow function don't introduce their own this
  // https://strongloop.com/strongblog/an-introduction-to-javascript-es6-arrow-functions/ for more an-introduction-to-javascript-es6-arrow-functions
  // const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }

    // hash (encrypt) our password using the salt
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) { return next(err) }

      // overwrite plaint text password with encrypted password
      this.password = hash
      // means go ahead and save the model
      next()
    })
  });
});

// adding function to userSchema method object that will be available when a user object is created
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // this is a reference to user model, this.password is our hash + salt password
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err) }

    callback(null, isMatch)
  })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
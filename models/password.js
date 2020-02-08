var passwordValidator = require("password-validator");

let Schema = new passwordValidator();

Schema.is()
  .min(8) // Minimum length 8
  .is()
  .max(50) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .symbols()
  .has()
  .digits() // Must have digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

module.exports = Schema;

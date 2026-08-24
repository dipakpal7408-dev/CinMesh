const validator = require("validator");

const isValidEmail = (email) => validator.isEmail(email || "");

const isStrongEnoughPassword = (password) =>
  typeof password === "string" && password.length >= 6;

module.exports = { isValidEmail, isStrongEnoughPassword };

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePlaylistInput(data) {
  let errors = {};

  // If any field does not exist, replace with an empty string
  data.name = !isEmpty(data.name) ? data.name : "";
  data.platform = !isEmpty(data.platform) ? data.platform : "";
  data.url = !isEmpty(data.url) ? data.url : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }

  if (Validator.isEmpty(data.platform)) {
    errors.platform = "platform field is required";
  }

  if (Validator.isEmpty(data.url)) {
    errors.url = "url field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

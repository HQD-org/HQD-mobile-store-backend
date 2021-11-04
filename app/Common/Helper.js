const generateString = (length, containNaN) => {
  let result = "";
  let characters = "0123456789";
  if (containNaN) {
    characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    result = "0";
  }
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const mapToRegexExactly = (object) => {
  Object.keys(object).map((key) => {
    object[key] = new RegExp("^" + object[key] + "$", "i");
  });
  return object;
};

const mapToRegexContains = (object) => {
  Object.keys(object).map((key) => {
    object[key] = new RegExp(object[key], "i");
  });
  return object;
};

module.exports = {
  generateString,
  mapToRegexContains,
  mapToRegexExactly,
};

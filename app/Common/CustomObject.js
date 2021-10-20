const CustomObject = (object) => {
  for (const [key, value] of Object.entries(object)) {
    [Symbol.iterator] : new RegExp("^" + value + "$", "i");
  }
};

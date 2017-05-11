const DOM = Symbol.for("dom");

module.exports = {
  print(val, print) {
    return (
      print(val[DOM]) +
      "\n------------HTML PREVIEW---------------\n" +
      print(val[DOM])
    );
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, DOM);
  }
};

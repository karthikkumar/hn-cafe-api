// excludes min and includes max
const numbersInRange = (min, max) =>
  [...Array(max - min).keys()].map((i) => i + min + 1);

module.exports = {
  numbersInRange,
};

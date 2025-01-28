function formatNumber(number) {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + "B"; // Billion
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + "M"; // Million
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + "K"; // Thousand
  } else {
    return number.toString();
  }
}

module.exports = {
  formatNumber,
};

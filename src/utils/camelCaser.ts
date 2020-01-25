export default (str: string) => {
  return str
    .split("-")
    .map((val, i) => {
      if (i > 0) {
        return val.charAt(0).toUpperCase() + val.slice(1);
      } else {
        return val;
      }
    })
    .join("");
};

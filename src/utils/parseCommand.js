const setExpireParser = (command, strArray) => {
  const key = strArray[1];
  const value = `${strArray.slice(2, strArray.length).join(" ")}`;
  return { command, key, value: value.replace(/['"]+/g, "") };
};

const saddParser = (command, strArray) => {
  const key = strArray[1];
  const value = `${strArray.slice(2, strArray.length).join(" ")}`;
  const pattern = /".*?"/g;
  const valArr = value.match(pattern);
  const values = [];
  for (let i = 0; i < valArr.length; i += 1) {
    values.push(valArr[i]);
  }
  return { command, key, values: values.map((el) => el.replace(/['"]+/g, "")) };
};

const getParser = (command, strArray) => {
  const key = strArray[1];
  return { command, key };
};

const delExsitsSinterParser = (command, strArray) => {
  const keys = [];
  for (let i = 1; i < strArray.length; i += 1) {
    keys.push(strArray[i]);
  }
  return { command, keys };
};

const parseCommand = (str) => {
  const strArr = str.split(" ");
  const command = strArr[0];

  switch (command) {
    case "SET":
      return setExpireParser(command, strArr);
    case "EXPIRE":
      return setExpireParser(command, strArr);
    case "SADD":
      return saddParser(command, strArr);
    case "GET":
      return getParser(command, strArr);
    default:
      //DEL, EXISTS, SINTER
      //KEYS - missing implementation
      return delExsitsSinterParser(command, strArr);
  }
};

export default parseCommand;

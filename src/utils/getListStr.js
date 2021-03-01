const getListStr = (list) => {
  const listArr = [];

  if (!list.length) return `(empty list or set)`;

  for (let i = 0; i < list.length; i += 1) {
    listArr.push(`${i + 1}) ${list[i]}`);
  }

  return listArr.join("\n");
};

export default getListStr;

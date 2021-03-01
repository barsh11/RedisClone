import getListStr from "./getListStr";
import { isSet, isString } from "./typeCheck";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* SET function by the following rules: https://redis.io/commands/set */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const set = (key, value) => {
  const toStore = { value, expire: null };
  localStorage.setItem(key, JSON.stringify(toStore));
  return '"OK"';
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* GET function by the following rules: https://redis.io/commands/get */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const get = (key) => {
  const storedVal = JSON.parse(localStorage.getItem(`${key}`));

  if (storedVal) {
    // If value stored is not a string throw an error.
    if (!isString(storedVal.value)) {
      throw new Error(
        `value stored at ${key} is not a string. GET only handles string values.\nPlease try again.`
      );
    }

    // Return value of key if key exist
    if (storedVal.value) {
      return `"${storedVal.value}"`;
    }
  }

  // If key does not exist, return nil
  return "(nil)";
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* EXISTS function by the following rules: https://redis.io/commands/exists */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const exists = (keys) => {
  let numKeysEx = 0;

  keys.forEach((key) => {
    const value = localStorage.getItem(`${key}`);
    if (value) {
      numKeysEx += 1;
    }
  });

  // If key does not exist, return 0
  if (!numKeysEx) {
    return "(integer) 0";
  }

  // Return number of keys existing among the specified ones.
  // Keys mentioned multiple times and existing are counted multiple times.
  return `(integer) ${numKeysEx}`;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* DEL function by the following rules: https://redis.io/commands/del */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const del = (keys) => {
  let numKeysDel = 0;

  // For each key user wish to delete
  keys.forEach((key) => {
    // If the key exists, remove it.
    // Otherwise, ignore it.
    if (exists([key]) === "(integer) 1") {
      localStorage.removeItem(`${key}`);
      numKeysDel += 1;
    }
  });

  // Return number of keys that were removed.
  return `(integer) ${numKeysDel}`;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* EXPIRE function by the following rules: https://redis.io/commands/expire */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const expire = (key, value) => {
  const storedVal = JSON.parse(localStorage.getItem(`${key}`));
  const now = new Date();

  // If value is non positive, the key will be delted.
  if (value <= 0) return del([key]);

  // If there was no expiry time on key, set expiry time.
  // If there was an expiry time that is no later than now, set expiry time.
  if (storedVal.expire === null || now.getTime() < storedVal.expire) {
    storedVal.expire = now.getTime() + value * 1000;
    localStorage.setItem(key, JSON.stringify(storedVal));
    return "(integer) 1";
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* SADD function by the following rules: https://redis.io/commands/sadd */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sadd = (key, values) => {
  let numElAdd = 0;

  const storedVal = JSON.parse(localStorage.getItem(`${key}`));
  const arr = storedVal ? storedVal.value.slice() : [];

  // If key does not exist, a new set is created *before* adding the specified members.
  if (exists([key]) !== "(integer) 1") {
    const toStore = { value: values.slice(), expire: null };
    localStorage.setItem(key, JSON.stringify(toStore));
  }

  // If value stored is not a set throw an error.
  if (!isSet(arr)) {
    throw new Error(
      `value stored at ${key} is not a set. SADD only handles array values.\nPlease try again.`
    );
  }

  for (let i = 0; i < values.length; i += 1) {
    // If the member is not in the set, add it.
    // Otherwise, ignore it.
    if (!arr.includes(values[i])) {
      arr.push(values[i]);
      numElAdd++;
    }
  }

  const newStoredVal = JSON.parse(localStorage.getItem(`${key}`));
  localStorage.setItem(
    `${key}`,
    JSON.stringify({ ...newStoredVal, value: arr })
  );

  // Return number of keys that were added to the set.
  return `(integer) ${numElAdd}`;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* SINTER function by the following rules: https://redis.io/commands/sinter */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const sinter = (keys) => {
  const data = [];

  for (let i = 0; i < keys.length; i += 1) {
    data[i] = JSON.parse(localStorage.getItem(`${keys[i]}`)).value;
  }

  // Finding intersection members
  const result = data.reduce((a, b) => a.filter((c) => b.includes(c)));

  // Return the members of the set resulting from the intersection,
  // If the result it empty set, empty string will be returned.
  return `${getListStr(result)}`;
};

// const keys= (keys) => {}

export const updateStorage = (command) => {
  try {
    switch (command.command) {
      case "SET":
        return set(command.key, command.value);
      case "DEL":
        return del(command.keys);
      case "EXISTS":
        return exists(command.keys);
      case "EXPIRE":
        return expire(command.key, command.value);
      case "SADD":
        return sadd(command.key, command.values);
      case "SINTER":
        return sinter(command.keys);
      // case "KEYS":
      // return keys(command.keys);
      default:
        return get(command.key);
    }
  } catch (err) {
    return err.message;
  }
};

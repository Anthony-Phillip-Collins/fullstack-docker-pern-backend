const assertNever = (
  value: never,
  message = `No such case in exhaustive switch: \n${JSON.stringify(value)}`
): never => {
  throw Error(message);
};

export default assertNever;

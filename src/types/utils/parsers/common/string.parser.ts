export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const parseString = (value: unknown, prop?: unknown): string => {
  if (!value || !isString(value)) {
    let errorMessage = `The value provided is not a string: "${value}"`;
    if (prop && isString(prop)) {
      errorMessage = `The value of ${prop} is invalid: "${value}"`;
    }
    throw new Error(errorMessage);
  }
  return value;
};

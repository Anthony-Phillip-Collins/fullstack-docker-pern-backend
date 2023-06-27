export const isNumber = (value: unknown): value is number => {
  const val = Number(value);
  return typeof val === 'number' || !isNaN(val);
};

export const parseNumber = (value: unknown, prop?: unknown): number => {
  if (!isNumber(value) || (isNumber(value) && value < 0)) {
    let errorMessage = `The value provided is not a number: "${value}"`;
    if (prop && isNumber(prop)) {
      errorMessage = `The value of ${prop} is invalid: "${value}"`;
    }
    throw new Error(errorMessage);
  }
  return value;
};

import { isString } from './string.parser';

const hasDateFormat = (value: string): boolean => {
  /* correct format: yyyy-mm-dd or yyyy-m-d */
  const year = { min: 4, max: 4 };
  const month = { min: 1, max: 2 };
  const day = month;
  const format = [year, month, day];
  const split = value.split('-');
  return (
    split.length === format.length &&
    split.reduce((result, v, i) => result && v.length <= format[i].max && v.length >= format[i].min, true)
  );
};

export const isDate = (value: string): boolean => {
  return !!value && Boolean(Date.parse(value)) && hasDateFormat(value);
};

export const parseDate = (value: unknown, prop?: unknown): string => {
  if (!value || !isString(value) || !isDate(value)) {
    let errorMessage = `The value provided is not a date: "${value}"`;
    if (prop && isString(prop)) {
      errorMessage = `The value of ${prop} is invalid: "${value}"`;
    }
    throw new Error(errorMessage);
  }
  return value;
};

import { isString } from './string.parser';

export const isPassword = (text: unknown): text is string => {
  return isString(text) && text.length >= 3;
};

export const parsePassword = (value: unknown): string => {
  if (!value || !isPassword(value)) {
    const errorMessage = `Password not accepted. It has to be at least 3 characters long!`;
    throw new Error(errorMessage);
  }
  return value;
};

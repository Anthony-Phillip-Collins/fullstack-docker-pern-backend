export const isObject = (object: unknown): object is object => !!object && typeof object === 'object';

export const compareObjectShapes = (object: unknown, blueprint: object): boolean => {
  if (!isObject(object)) {
    return false;
  }

  const mandatory = Object.keys(blueprint);
  const keyLengthOk = Object.keys(object).length === Object.keys(blueprint).length;
  const keysOk = mandatory.filter((m) => m in object).length === mandatory.length;
  return keyLengthOk && keysOk;
};

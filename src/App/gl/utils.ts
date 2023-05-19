export const deg2rad = (degree: number) => degree / 180 * Math.PI;

export function throwErrorIfInvalid<T>(a: T | null | undefined): T {
  if (a === null || a === undefined) {
    throw Error('value is null or undifined');
  }
  return a;
}

export function consoleWarningIfInvalid<T>(a: T): T {
  if (a === null || a === undefined) {
    console.log('value is null or undifined');
  }
  return a;
}

export function defaultValueIfInvalid<T>(a: T, defaultValue: T): T {
  if (a === null || a === undefined || Number.isNaN(a)) {
    console.log('value is null or undifined');
    return defaultValue;
  }
  return a;
}

export function clamp(value: number, min: number, max: number) {
  return value < min
    ? min
    : value > max
      ? max
      : value;
}
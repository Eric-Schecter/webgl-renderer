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


export const distributeArray = <T = any>(
  flatArray: Array<T>,
  groupSize: number
): Array<Array<T>> => {
  if (groupSize < 1 || !Number.isInteger(groupSize)) return null;
  return flatArray.reduce((accumulate, current, index) => {
    if (index % groupSize === 0) {
      accumulate.push([current]);
    } else {
      accumulate[Math.floor(index / 2)]?.push?.(current);
    }
    return accumulate;
  }, [] as T[][]);
};

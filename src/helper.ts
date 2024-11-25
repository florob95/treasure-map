export const convertToMap = <T, KEY>(
  toMap: T[],
  keyOfElement: (toMapElement: T) => KEY,
): Map<KEY, T> => {
  return toMap.reduce(
    (map, obj) => map.set(keyOfElement(obj), obj),
    new Map<KEY, T>(),
  )
}

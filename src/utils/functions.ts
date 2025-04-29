export function uniqueArray<T>(arr: T) {
  //@ts-ignore
  return [...new Set(arr)];
}
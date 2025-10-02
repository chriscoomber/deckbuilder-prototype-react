export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  const retArry = [];
  while (arr.length > 0) {
    const index = Math.floor(Math.random() * arr.length);
    retArry.push(...arr.splice(index, 1));
  }
  return retArry;
}


export const createArrayOf = (size, fn) => Array.apply(null, Array(size)).map(() => fn());

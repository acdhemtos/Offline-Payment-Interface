import { base } from '../config';

export const getRelativePath = (path) => {
  const rel = base.substring(0, base.length - 1);
  return `${rel}${path}`;
};
export const getRelativePath = (path) => {
  const rel = "/opi" //remove this on server "
  const basePath = rel + "/account"
  
  return `${basePath}${path}`;
};
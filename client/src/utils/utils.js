export const getRelativePath = (path) => {
  //base is in vite.config.js
  //const rel = "/"+base.substring(0, base.length - 1);
  const rel = "/opi" //remove this on server "
  
  return `${rel}${path}`;
};
/*


*/
// self.addEventListener("message", (e) => {
//   const { category, level, lvl } = e.data;
//   if (level[category]) {
//     self.postMessage({ currentLevel: lvl, sub: level[category] });
//   }
// });

self.addEventListener("message", (e) => {
  const { allLevels, category } = e.data;
  allLevels.forEach((level, index) => {
    if (level[category]) {
      self.postMessage({ currentLevel: index + 1, sub: level[category] });
    }
  });
});

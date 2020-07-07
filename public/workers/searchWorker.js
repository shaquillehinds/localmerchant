self.addEventListener("message", (e) => {
  console.log("from search worker");
  const { parentLevel, parent, all, current } = e.data;
  for (let lvl in all) {
    if (parentLevel === lvl) {
      for (let cat in all[lvl]) {
        if (parent === cat) {
          return self.postMessage({ parent: [parent], current, sub: all[lvl][cat].categories });
        }
      }
    }
  }
  const category = parent;
  for (let level in all) {
    const currentLevel = all[level];
    for (let cat in currentLevel) {
      if (cat === category) {
        return self.postMessage({
          parent: [currentLevel[cat].parent],
          sub: currentLevel[cat].categories,
        });
      }
    }
  }
});

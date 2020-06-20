self.addEventListener("message", (e) => {
  const { all, category } = e.data;
  let loopBreak = false;
  for (let level in all) {
    if (loopBreak) break;
    const currentLevel = all[level];
    for (let cat in currentLevel) {
      if (cat === category) {
        self.postMessage({
          parent: currentLevel[cat].parent,
          sub: currentLevel[cat].categories,
          currentLevel: level,
        });
        loopBreak = true;
        break;
      }
    }
  }
});

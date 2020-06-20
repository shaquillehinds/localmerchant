self.addEventListener("message", (e) => {
  const { parentLevel, parent, all } = e.data;
  let loopBreak = false;
  for (let lvl in all) {
    if (loopBreak) break;
    if (parentLevel === lvl) {
      for (let cat in all[lvl]) {
        if (parent === cat) {
          console.log(parent);
          self.postMessage({ parent, sub: all[lvl][cat].categories });
        }
      }
    }
  }
});

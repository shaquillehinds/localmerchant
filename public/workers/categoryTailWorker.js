self.addEventListener("message", (e) => {
  console.log("from category Tail Worker");
  const { tails, category, tail, all } = e.data;
  if (tail) {
    const parent = tails[tail].parent;
    const chain = [parent];
    let loopBreak = false;
    for (let level in all) {
      if (loopBreak) break;
      const currentLevel = all[level];
      for (let cat in currentLevel) {
        if (cat === parent) {
          const categories = currentLevel[cat].parent.concat(chain);
          const endTail = currentLevel[cat].categories.filter((item) => item.toLowerCase() === tail);
          categories.push(endTail[0]);
          loopBreak = true;
          return self.postMessage({
            categories,
          });
        }
      }
    }
  }
  const lowerCat = category.toLowerCase();
  let loopBreak = false;
  for (let t in tails) {
    if (loopBreak) break;
    if (lowerCat === t) {
      loopBreak = true;
      return self.postMessage({
        parent: [tails[t].parent],
      });
    }
  }
});

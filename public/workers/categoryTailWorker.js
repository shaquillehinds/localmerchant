self.addEventListener("message", (e) => {
  const { tails, category } = e.data;
  const lowerCat = category.toLowerCase();
  let loopBreak = false;
  for (let tail in tails) {
    if (loopBreak) break;
    if (lowerCat === tail) {
      loopBreak = true;
      self.postMessage({
        parent: [tails[tail].parent],
      });
    }
  }
});

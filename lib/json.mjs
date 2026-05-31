export function extractLargestJSON(text) {
  let best = null;
  let bestLength = 0;
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (text[i] === "}") {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        const slice = text.slice(start, i + 1);
        try {
          const candidate = JSON.parse(slice);
          if (slice.length > bestLength) {
            best = candidate;
            bestLength = slice.length;
          }
        } catch {}
        start = -1;
      }
    }
  }

  return best;
}

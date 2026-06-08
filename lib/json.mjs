export function extractLargestJSON(text) {
  let best = null;
  let bestLength = 0;
  let depth = 0;
  let start = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (char === "}") {
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
      } else if (depth < 0) {
        // Reset if we have unmatched closing braces
        depth = 0;
        start = -1;
      }
    }
  }

  return best;
}

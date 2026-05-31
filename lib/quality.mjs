export function countComparisonQuality(data) {
  return [
    data?.reddit?.posts?.length > 0,
    Boolean(data?.trustpilot?.details?.rating),
    data?.techcrunch?.articles?.length > 0,
  ].filter(Boolean).length;
}

export function shouldRejectComparisonForNoData(dataA, dataB) {
  return countComparisonQuality(dataA) === 0 && countComparisonQuality(dataB) === 0;
}

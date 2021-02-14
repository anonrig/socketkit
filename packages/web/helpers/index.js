export const averageRating = (ratings) => {
  if (!ratings) return null
  const sum = ratings?.map((r, i) => r * (i + 1)).reduce((a, b) => a + b)
  const count = ratings?.reduce((a, b) => a + b)
  return (sum / count).toFixed(2)
}

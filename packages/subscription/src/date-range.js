import dayjs from 'dayjs'

export function getDateRange(start, end) {
  let startDate = dayjs(start)
  const endDate = dayjs(end)

  const range = []
  while (!startDate.isSame(endDate, 'day')) {
    range.push(startDate.toISOString())
    startDate = startDate.add(1, 'day')
  }
  return range
}

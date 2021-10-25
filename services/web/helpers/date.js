import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function setDateRangeIfNeeded(router, path, props = {}) {
  const { start_date, end_date } = router.query

  if (!start_date || !end_date) {
    router.push(
      {
        path,
        query: {
          start_date: dayjs.utc().subtract(1, 'month').format('YYYY-MM-DD'),
          end_date: dayjs.utc().format('YYYY-MM-DD'),
          ...props,
        },
      },
      undefined,
      { shallow: true },
    )
  }
}

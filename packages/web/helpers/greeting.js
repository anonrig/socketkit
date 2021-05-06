import dayjs from 'dayjs'

export default function getLabel() {
  const hr = dayjs().hour()
  if (hr >= 0 && hr < 12) {
    return 'Good morning'
  } else if (hr >= 12 && hr <= 17) {
    return 'Good afternoon'
  } else {
    return 'Good evening'
  }
}

import { useContext, useState } from 'react'
import dayjs from 'dayjs'
import CountriesWidget from '../components/scenes/dashboard/countries-widget.js'
import RangePicker from '../components/scenes/dashboard/range-picker.js'
import StatisticsWidget from '../components/scenes/dashboard/statistics-widget.js'
import { AuthContext } from '../helpers/is-authorized.js'

export default function Dashboard() {
  const { session } = useContext(AuthContext)
  const ranges = [
    {
      key: 'last-90',
      title: 'Last 90 Days',
      from: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    },
    {
      key: 'last-30',
      title: 'Last 30 Days',
      from: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    },
    {
      key: 'last-7',
      title: 'Last 7 Days',
      from: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
    },
  ]
  const [selected, setSelected] = useState(ranges[1])

  return (
    <>
      <div className="flex flex-1 space-between mb-5 items-center justify-center">
        <div className="flex-1">
          <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-3xl">
            Good morning, {session?.identity.traits.name?.split(' ')[0]}!
          </h3>
          <p className="text-xl text-gray-400">Understand your audience better.</p>
        </div>

        <RangePicker selected={selected} setSelected={setSelected} ranges={ranges} />
      </div>
      <section className="space-y-8">
        <StatisticsWidget range={selected} />
        <CountriesWidget range={selected} />
      </section>
    </>
  )
}

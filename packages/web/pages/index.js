import { useContext, useState } from 'react'
import dayjs from 'dayjs'

import { fetcher } from 'helpers/fetcher.js'
import CountriesWidget from 'components/scenes/dashboard/countries-widget.js'
import RangePicker from 'components/scenes/dashboard/range-picker.js'
import StatisticsWidget from 'components/scenes/dashboard/statistics-widget.js'
import { AuthContext } from 'helpers/is-authorized.js'
import CustomersWidget from '../components/scenes/dashboard/subscribers-widget.js'

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  try {
    const from = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
    const to = dayjs().format('YYYY-MM-DD')
    const countries = await fetcher(`accounts/countries`, {
      headers: { cookie, referer },
      qs: { from, to, limit: 10 },
    })

    return {
      props: {
        countries,
      },
    }
  } catch (error) {
    return { props: { countries: [] } }
  }
}

export default function Dashboard({ countries }) {
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

  const getLabel = () => {
    const hr = dayjs().hour()
    if (hr >= 0 && hr < 12) {
      return 'Good morning'
    } else if (hr >= 12 && hr <= 17) {
      return 'Good afternoon'
    } else {
      return 'Good evening'
    }
  }

  return (
    <>
      <div className="flex flex-1 space-between mb-10 items-center justify-center flex-col md:flex-row space-y-6 md:space-y-0">
        <div className="flex-1">
          <h3 className="font-extrabold text-warmGray-900 sm:tracking-tight text-3xl">
            {getLabel()}, {session?.identity.traits.name?.split(' ')[0]}!
          </h3>
        </div>

        <RangePicker selected={selected} setSelected={setSelected} ranges={ranges} />
      </div>
      <section className="space-y-10">
        <StatisticsWidget range={selected} />
        <CustomersWidget range={selected} />
        <CountriesWidget range={selected} initialData={countries} />
      </section>
    </>
  )
}

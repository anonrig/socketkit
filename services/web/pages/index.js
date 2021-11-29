import DatePicker from 'components/date-picker'
import StatisticsWidget from 'components/scenes/dashboard/statistics-widget'
import CustomersWidget from 'components/scenes/dashboard/subscribers-widget'
import dayjs from 'dayjs'
import { AuthContext } from 'helpers/context'
import getGreeting from 'helpers/greeting'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { useContext, useState } from 'react'

// countries require country list dependency. therefore it should be dynamically loaded
// to reduce page loading time
const CountriesWidget = dynamic(() => import('components/scenes/dashboard/countries-widget'))

function Dashboard() {
  const { integration, session } = useContext(AuthContext)
  const maxDate = dayjs(integration?.last_fetch ?? undefined)
  const [interval, setInterval] = useState({
    end_date: maxDate,
    start_date: maxDate.subtract(1, 'month'),
  })

  return (
    <>
      <NextSeo title="Dashboard" />
      <div className="flex flex-1 space-between mb-10 items-center justify-center flex-col md:flex-row space-y-6 md:space-y-0">
        <h3 className="font-extrabold text-warmGray-900 sm:tracking-tight text-3xl flex-1">
          {getGreeting()}, {session?.identity.traits.name?.split(' ')[0]}!
        </h3>

        <DatePicker
          interval={interval}
          setInterval={(interval) => setInterval(interval)}
          maxDate={maxDate.toDate()}
        />
      </div>
      <section className="space-y-10">
        <StatisticsWidget
          range={{
            end_date: interval.end_date.format('YYYY-MM-DD'),
            start_date: interval.start_date.format('YYYY-MM-DD'),
          }}
        />

        <CustomersWidget
          range={{
            end_date: interval.end_date.format('YYYY-MM-DD'),
            start_date: interval.start_date.format('YYYY-MM-DD'),
          }}
        />
        <CountriesWidget
          range={{
            end_date: interval.end_date.format('YYYY-MM-DD'),
            start_date: interval.start_date.format('YYYY-MM-DD'),
          }}
        />
      </section>
    </>
  )
}

export default Dashboard

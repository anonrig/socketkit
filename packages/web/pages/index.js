import { useContext, useState } from 'react'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import useSWR from 'swr'

import { AuthContext } from 'helpers/is-authorized.js'
import { fetcher, getUrl } from 'helpers/fetcher.js'

import DatePicker from 'components/date-picker.js'
import StatisticsWidget from 'components/scenes/dashboard/statistics-widget.js'
import CustomersWidget from 'components/scenes/dashboard/subscribers-widget.js'
import CheckoutButton from 'components/checkout-button.js'

// countries require country list dependency. therefore it should be dynamically loaded
// to reduce page loading time
const CountriesWidget = dynamic(() => import('components/scenes/dashboard/countries-widget'))

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  try {
    const from = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
    const to = dayjs().format('YYYY-MM-DD')
    const headers = { cookie, referer }
    const [countries, payment] = await Promise.all([
      fetcher(`accounts/countries`, {
        headers,
        qs: { from, to },
      }),
      fetcher(`payments/state`, { headers }),
    ])
    return {
      props: {
        countries,
        payment,
      },
    }
  } catch (error) {
    console.error(error)
    return { props: { countries: [], payment: { subscription_state: 'inactive' } } }
  }
}

export default function Dashboard({ countries, payment }) {
  const { data: paymentsData } = useSWR(`payments/state`, fetcher, { initialData: payment })
  const { session } = useContext(AuthContext)
  const [interval, setInterval] = useState({
    from: dayjs().subtract(1, 'month'),
    to: dayjs(),
  })

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
        <h3 className="font-extrabold text-warmGray-900 sm:tracking-tight text-3xl flex-1">
          {getLabel()}, {session?.identity.traits.name?.split(' ')[0]}!
        </h3>

        <DatePicker
          interval={{ start_date: interval.from, end_date: interval.to }}
          setInterval={({ start_date, end_date }) =>
            setInterval({ from: start_date, to: end_date })
          }
        />
      </div>
      <section className="space-y-10">
        <StatisticsWidget
          range={{ from: interval.from.format('YYYY-MM-DD'), to: interval.to.format('YYYY-MM-DD') }}
        />

        {['web', 'canceled'].includes(paymentsData.state) && <CheckoutButton />}

        <CustomersWidget
          range={{ from: interval.from.format('YYYY-MM-DD'), to: interval.to.format('YYYY-MM-DD') }}
        />
        <CountriesWidget
          range={{ from: interval.from.format('YYYY-MM-DD'), to: interval.to.format('YYYY-MM-DD') }}
          initialData={countries}
        />
      </section>
    </>
  )
}

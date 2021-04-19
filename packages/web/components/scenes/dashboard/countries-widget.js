import PropTypes from 'prop-types'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import countries from 'helpers/countries.json'
import { fetcher } from 'helpers/fetcher.js'

const TreeMapChart = dynamic(() =>
  import('components/charts/treemap.js' /* webpackChunkName: "TreeMapChart" */),
)

function CountriesWidget({ range, initialData }) {
  const { data } = useSWR(
    `accounts/countries?from=${range.from}&to=${range.to}&limit=10`,
    fetcher,
    { initialData, refreshInterval: 0 },
  )

  const letters = '0123456789ABCDEF'

  function getRandomColor() {
    let color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  return (
    <section className="lg:col-span-4">
      <dl className="grid grid-cols-1 md:grid-cols-4 lg:space-x-6 bg-white shadow-lgs rounded-md">
        <div className="col-span-2 flex flex-1 flex-col justify-center items-left rounded-md overflow-hidden h-80">
          <h3 className="font-bold text-warmGray-900 sm:tracking-tight text-2xl py-3.5 px-4 sm:px-6 z-10">
            Countries
          </h3>

          <TreeMapChart
            id="Countries Summary"
            rows={(data ?? []).map((c) => ({
              id: countries[c.country_id.toLowerCase()]?.name,
              value: c.revenue,
              color: getRandomColor(),
            }))}
            identity="id"
            value="id"
          />
        </div>
        <div className="col-span-2 flex flex-1">
          <div className="bg-white sm:overflow-hidden w-full sm:px-6 lg:px-0 rounded-md">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="w-full lg:px-8">
                <div className="overflow-hidden lg:pt-2 pl-6 lg:pl-0">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-trueGray-500 uppercase tracking-wider">
                        <th className="pr-6 py-3.5 lg:py-4 text-xs font-medium" scope="col">
                          Name
                        </th>
                        <th
                          className="px-6 py-3.5 lg:py-4 text-xs font-medium text-right"
                          scope="col">
                          Churn Rate
                        </th>
                        <th
                          className="px-6 py-3.5 lg:py-4 text-xs font-medium text-right"
                          scope="col">
                          Conversion Rate
                        </th>
                        <th
                          className="px-6 py-3.5 lg:py-4 text-xs font-medium text-right"
                          scope="col">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {data?.slice(0, 5).map((c) => (
                        <tr key={c.country_id}>
                          <td className="pr-6 py-4 whitespace-nowrap text-sm font-medium text-warmGray-900">
                            {countries[c.country_id.toLowerCase()]?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500 text-right">
                            {((c.churn_count / c.total_count) * 100).toFixed(2)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500 text-right">
                            {((c.trial_past_count / c.total_count) * 100).toFixed(2)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500 text-right">
                            ${c.revenue ?? 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dl>
    </section>
  )
}

CountriesWidget.propTypes = {
  range: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }),
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      country_id: PropTypes.string.isRequired,
      churn_count: PropTypes.number.isRequired,
      total_count: PropTypes.number.isRequired,
      trial_past_count: PropTypes.number.isRequired,
      revenue: PropTypes.number.isRequired,
    }),
  ),
}

export default CountriesWidget

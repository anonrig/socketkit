import PropTypes from 'prop-types'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

const TreeMapChart = dynamic(
  () => import('components/charts/treemap.js' /* webpackChunkName: "TreeMapChart" */),
  { ssr: false },
)

function CountriesWidget({ range }) {
  const { data } = useSWR(`accounts/countries?from=${range.from}&to=${range.to}&limit=10`)

  function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  return (
    <section className="lg:col-span-4">
      <div className="space-y-0.5 mb-5">
        <h3 className="font-extrabold text-warmGray-900 sm:tracking-tight text-2xl">Countries</h3>
        <p className="text-md text-trueGray-500">Most promising 5 countries on your audience.</p>
      </div>
      <dl className="grid grid-cols-1 md:grid-cols-4 lg:space-x-6 space-y-6">
        <div className="col-span-2 flex flex-1 justify-center items-center rounded-md overflow-hidden">
          <TreeMapChart
            id="countries"
            rows={(data ?? []).map((c) => ({
              id: c.country_name,
              value: c.revenue,
              color: getRandomColor(),
            }))}
            identity="id"
            value="id"
          />
        </div>
        <div className="col-span-2 flex flex-1">
          <div className="bg-white shadow sm:rounded-md sm:overflow-hidden w-full sm:px-6 lg:px-0">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="w-full lg:px-8">
                <div className="overflow-hidden border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-warmGray-50 text-left text-trueGray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 text-xs font-medium" scope="col">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right" scope="col">
                          Churn Rate
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right" scope="col">
                          Conversion Rate
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-right" scope="col">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data?.slice(0, 5).map((country) => (
                        <tr key={country.country_id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-warmGray-900">
                            {country.country_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500 text-right">
                            {((country.churn_count / country.total_count) * 100).toFixed(2)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500 text-right">
                            {((country.trial_past_count / country.total_count) * 100).toFixed(2)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500 text-right">
                            ${country.revenue ?? 0}
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
}

export default CountriesWidget

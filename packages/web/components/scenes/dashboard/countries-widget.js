import { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import Panel from '../../../components/panel.js'
import CountrySlide from './countries-slide.js'

function CountriesWidget({ range }) {
  const [isVisible, setVisible] = useState(false)
  const { data } = useSWR(
    `accounts/countries?from=${range.from}&to=${range.to}`,
  )
  const geoUrl =
    'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

  return (
    <section
      aria-labelledby="countries_widget_heading"
      className="lg:col-span-4"
    >
      <Panel
        isVisible={isVisible}
        setVisible={setVisible}
        title="Countries"
        subtitle="Current status of your account"
      >
        <CountrySlide data={data} />
      </Panel>
      <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-2xl">
        Countries
      </h3>
      <p className="text-lg text-gray-400">
        Most promising 4 countries on your audience.
      </p>
      <dl className="grid grid-cols-1 md:grid-cols-4 space-x-6">
        <div className="col-span-2">
          <div className="bg-white shadow sm:rounded-md sm:overflow-hidden mt-5">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th
                            className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            scope="col"
                          >
                            Name
                          </th>
                          <th
                            className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            scope="col"
                          >
                            Churn Rate
                          </th>
                          <th
                            className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            scope="col"
                          >
                            Conversion Rate
                          </th>
                          <th
                            className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            scope="col"
                          >
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data?.slice(0, 4).map((country) => (
                          <tr key={country.country_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {country.country_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(
                                (country.churn_count / country.total_count) *
                                100
                              ).toFixed(2)}
                              %
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(
                                (country.trial_past_count /
                                  country.total_count) *
                                100
                              ).toFixed(2)}
                              %
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${country.revenue ?? 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="p-6">
                      <button
                        onClick={() => setVisible(true)}
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-1 justify-center items-center">
          <ComposableMap
            projectionConfig={{ scale: 188 }}
            className="h-96 w-full"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} />
                ))
              }
            </Geographies>
            {data?.map((d) => (
              <Marker
                coordinates={[d.country_coordinates.y, d.country_coordinates.x]}
                key={d.country_id}
              >
                <circle r={8} fill="#F53" />
              </Marker>
            ))}
          </ComposableMap>
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

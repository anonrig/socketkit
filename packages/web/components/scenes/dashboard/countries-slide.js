import PropTypes from 'prop-types'

function CountrySlide({ data }) {
  return (
    <table className="w-full divide-y divide-gray-200">
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
            Churn
          </th>
          <th
            className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            scope="col"
          >
            Conversion
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
        {data?.map((country) => (
          <tr key={country.country_id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {country.country_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {((country.churn_count / country.total_count) * 100).toFixed(2)}%
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {((country.trial_past_count / country.total_count) * 100).toFixed(
                2,
              )}
              %
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${country.revenue ?? 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

CountrySlide.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      country_id: PropTypes.string.isRequired,
      country_name: PropTypes.string.isRequired,
      revenue: PropTypes.number.isRequired,
      trial_past_count: PropTypes.number.isRequired,
      churn_count: PropTypes.number.isRequired,
      total_count: PropTypes.number.isRequired,
    }),
  ),
}

export default CountrySlide

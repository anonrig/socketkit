import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import dayjs from 'dayjs'
import theme from './theme.js'

function BarChart({ values, ...props }) {
  const keys = Object.keys(values.fields ?? {}).filter((k) => k !== 'x')

  return (
    <ResponsiveBar
      data={values.rows}
      indexBy="x"
      keys={keys}
      groupMode={'stacked'}
      borderRadius={0}
      borderColor="#3b82f6"
      borderWidth={1}
      margin={{ top: 10, right: 0, bottom: 35, left: 40 }}
      padding={0.2}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      animate={true}
      enableLabel={false}
      colors={['#bfdbfe']}
      theme={theme}
      tooltip={({ id, indexValue, value }) => {
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium flex">
              <p className="bg-white py-1 px-2 ml-auto rounded-md font-sans text-warmGray-900 shadow-md">
                {dayjs(indexValue).format('MMMM DD')}
              </p>
            </div>
            <div className="bg-white opacity-100 px-4 py-2 rounded-md text-left font-sans shadow-md text-warmGray-900">
              <div className="text-md font-bold">
                {(values.fields[id] ?? '').replace('%', value.toFixed(2))}
              </div>
            </div>
          </div>
        )
      }}
      enableGridX={false}
      enableGridY={true}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
      }}
      axisBottom={{
        enable: false,
        tickSize: 0,
        tickPadding: 0,
        format: () => '',
      }}
      {...props}
    />
  )
}

BarChart.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.string.isRequired,
      }),
    ).isRequired,
    fields: PropTypes.any,
  }).isRequired,
}

export default BarChart

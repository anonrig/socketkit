import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import dayjs from 'dayjs'
import theme from './theme.js'

function BarChart({ rows, fields, labelFormat }) {
  const tickValues =
    rows.length > 10
      ? rows.filter((r, i) => i % 4 == 0).map((r) => r.primary)
      : rows.map((r) => r.primary)

  const xValues = []
  const maximum = Math.max(...rows.map((r) => r[fields[0]]))
  const o = Math.floor(maximum / 5)
  for (let i = 0; i < maximum; i++) {
    if (i % o === 0) {
      xValues.push(i)
    }
  }

  return (
    <ResponsiveBar
      data={rows}
      keys={fields}
      borderRadius={0}
      borderColor="#3b82f6"
      borderWidth={1}
      indexBy="primary"
      margin={{ top: 10, right: 0, bottom: 35, left: 40 }}
      padding={0.2}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      animate={false}
      enableLabel={false}
      colors={['#bfdbfe']}
      groupMode={'stacked'} //stacked
      theme={theme}
      tooltip={({ indexValue, value }) => (
        <div className="bg-white opacity-100 px-4 py-2 rounded-md text-left font-sans shadow-md text-warmGray-900">
          <div className="text-md font-bold">{labelFormat(value)}</div>
          <div className="text-sm font-medium">{dayjs(indexValue).format('MMMM DD')}</div>
        </div>
      )}
      enableGridX={false}
      enableGridY={true}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickValues: xValues,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 20,
        tickRotation: 0,
        tickValues,
        format: (s) => dayjs(s).format('MMM DD, YY'),
      }}
    />
  )
}

BarChart.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  labelFormat: PropTypes.func.isRequired,
}

export default BarChart

import PropTypes from 'prop-types'
import { ResponsiveBar } from '@nivo/bar'
import dayjs from 'dayjs'
import theme from './theme.js'

function BarChart({ rows, fields, labelFormat }) {
  const tickValues =
    rows.length > 10
      ? rows.filter((r, i) => i % 4 == 0).map((r) => r.primary)
      : rows.map((r) => r.primary)

  return (
    <ResponsiveBar
      data={rows}
      keys={fields}
      indexBy="primary"
      margin={{ top: 10, right: 0, bottom: 35, left: 10 }}
      padding={0.2}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      labelTextColor={'#FAFAF9'}
      colors={['#FB923C', '#F97316']}
      groupMode={'stacked'} //stacked
      theme={theme}
      tooltip={({ indexValue, value }) => (
        <div className="bg-white opacity-80 px-4 py-2 rounded-md text-right font-sans shadow-md">
          <div className="text-sm font-bold">{labelFormat(value)}</div>
          <div className="text-xs font-medium">{dayjs(indexValue).format('MMMM DD')}</div>
        </div>
      )}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        enable: true,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 20,
        tickRotation: 0,
        tickValues,
        format: (s) => dayjs(s).format('MMMM DD'),
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

import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import dayjs from 'dayjs'
import theme from './theme.js'

function LineChart({ id, rows, fields, labelFormat }) {
  const tickValues =
    rows.length > 10
      ? rows.filter((r, i) => i % 4 == 0).map((r) => r.primary)
      : rows.map((r) => r.primary)
  return (
    <ResponsiveLine
      data={[
        {
          id,
          data: rows.map((r) => ({
            x: r.primary,
            y: fields[0] ? r[fields[0]] : 0,
          })),
        },
      ]}
      margin={{ top: 20, left: 40, right: 24, bottom: 35 }}
      padding={0.2}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      colors={['#FB923C', '#F97316']}
      pointColor={'#F97316'}
      pointSize={8}
      enableArea={true}
      min={0}
      enablePointLabel={false}
      enableGridX={false}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 20,
        tickRotation: 0,
        tickValues,
        format: (s) => dayjs(s).format('MMMM DD'),
      }}
      isInteractive={true}
      enableCrosshair={true}
      enableSlices={'x'}
      crosshairType={'y'}
      theme={theme}
      sliceTooltip={({ slice }) => (
        <div className="bg-white opacity-80 px-4 py-2 rounded-md text-right font-sans shadow-md">
          <div className="text-sm font-bold">{labelFormat(slice.points[0].data.y)}</div>
          <div className="text-xs font-medium">
            {dayjs(slice.points[0].data.x).format('MMMM DD')}
          </div>
        </div>
      )}
    />
  )
}

LineChart.propTypes = {
  id: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  labelFormat: PropTypes.func.isRequired,
}

export default LineChart

import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import dayjs from 'dayjs'
import theme from './theme.js'

function LineChart({ rows, formats, ...props }) {
  const fields = Object.keys(formats ?? {})
  const tickValues =
    rows.length > 10 ? rows.filter((r, i) => i % 4 == 0).map((r) => r.x) : rows.map((r) => r.x)

  const xValues = []
  const maximum = Math.max(...rows.map((r) => r[fields[0]]))
  const o = Math.floor(maximum / 5)
  for (let i = 0; i < maximum; i++) {
    if (i % o === 0) {
      xValues.push(i)
    }
  }

  return (
    <ResponsiveLine
      data={fields.map((field) => ({
        id: field,
        data: rows.map((r) => ({
          x: r.x,
          y: r[field],
        })),
      }))}
      curve="catmullRom"
      margin={{ top: 10, left: 40, right: 28, bottom: 35 }}
      padding={0.2}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      colors={['#3b82f6']}
      pointSize={0}
      enableArea={true}
      enableGridX={false}
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
      isInteractive={true}
      enableCrosshair={true}
      enableSlices={'x'}
      crosshairType={'y'}
      theme={theme}
      sliceTooltip={({ slice }) => (
        <div className="bg-white opacity-100 px-4 py-2 rounded-md text-left font-sans shadow-md text-warmGray-900">
          {slice.points.map((point) => (
            <div key={point.id} className="text-md font-bold">
              {(formats[point.serieId] ?? '').replace('%', point.data.yFormatted)}
            </div>
          ))}
          <div className="text-sm font-medium">
            {dayjs(slice.points[0].data.x).format('MMMM DD')}
          </div>
        </div>
      )}
      {...props}
    />
  )
}

LineChart.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  formats: PropTypes.object.isRequired,
}

export default LineChart

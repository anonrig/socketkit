import { ResponsiveLine } from '@nivo/line'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import theme from './theme'

function LineChart({ values, ...props }) {
  return (
    <ResponsiveLine
      data={values
        .map(({ id, rows, fields }) =>
          Object.keys(fields).map((field) => ({
            data: rows.map((row) => ({
              x: row.x,
              y: row[field.toString()],
            })),
            id: `${id}#${field}`,
          })),
        )
        .flat()}
      curve="catmullRom"
      margin={{ bottom: 35, left: 40, right: 28, top: 10 }}
      animate={true}
      motionConfig={{ damping: 15, stiffness: 90 }}
      colors={['#3b82f6']}
      pointSize={0}
      enableArea={true}
      enableGridX={false}
      axisLeft={{
        tickPadding: 10,
        tickSize: 0,
      }}
      axisBottom={{
        format: (s) => dayjs(s).format('MMM DD, YY'),
        tickPadding: 20,
        tickRotation: 0,
        tickSize: 0,
        tickValues: 'every week',
      }}
      isInteractive={true}
      enableCrosshair={true}
      enableSlices={'x'}
      crosshairType={'y'}
      theme={theme}
      xScale={{
        format: '%Y-%m-%d',
        type: 'time',
        useUTC: false,
      }}
      xFormat="time:%Y-%m-%d"
      sliceTooltip={({ slice: { points } }) => {
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium flex">
              <p className="bg-white py-1 px-2 ml-auto rounded-md font-sans text-stone-900 shadow-md">
                {dayjs(points[0].data.x).format('MMMM DD')}
              </p>
            </div>

            <div className="bg-white px-4 py-2 rounded-md text-left font-sans shadow-md text-stone-900">
              {points
                .sort((a, b) => a.y - b.y)
                .map((point) => {
                  const [serie_id, field_name] = point.serieId.split('#')
                  return (
                    <div key={point.id} className="text-md font-semibold">
                      {(
                        values.find((v) => v.id === serie_id)?.fields[field_name.toString()] ?? '%'
                      ).replace('%', point.data.yFormatted)}
                    </div>
                  )
                })}
            </div>
          </div>
        )
      }}
      {...props}
    />
  )
}

LineChart.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      fields: PropTypes.any,
      id: PropTypes.string.isRequired,
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
}

export default LineChart

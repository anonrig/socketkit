import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import dayjs from 'dayjs'
import theme from './theme.js'

function LineChart({ values, ...props }) {
  return (
    <ResponsiveLine
      data={values
        .map(({ id, rows, fields }) =>
          Object.keys(fields).map((field) => ({
            id: `${id}#${field}`,
            data: rows.map((row) => ({
              x: row.x,
              y: row[field],
            })),
          })),
        )
        .flat()}
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
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 20,
        tickRotation: 0,
        tickValues: 'every week',
        format: (s) => dayjs(s).format('MMM DD, YY'),
      }}
      isInteractive={true}
      enableCrosshair={true}
      enableSlices={'x'}
      crosshairType={'y'}
      theme={theme}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
      }}
      xFormat="time:%Y-%m-%d"
      sliceTooltip={({ slice: { points } }) => {
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium flex">
              <p className="bg-white py-1 px-2 ml-auto rounded-md font-sans text-warmGray-900 shadow-md">
                {dayjs(points[0].data.x).format('MMMM DD')}
              </p>
            </div>

            <div className="bg-white px-4 py-2 rounded-md text-left font-sans shadow-md text-warmGray-900">
              {points
                .sort((a, b) => a.y - b.y)
                .map((point) => {
                  const [serie_id, field_name] = point.serieId.split('#')
                  return (
                    <div key={point.id} className="text-md font-semibold">
                      {(values.find((v) => v.id === serie_id)?.fields[field_name] ?? '%').replace(
                        '%',
                        point.data.yFormatted,
                      )}
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
      id: PropTypes.string.isRequired,
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.string.isRequired,
        }),
      ).isRequired,
      fields: PropTypes.shape(PropTypes.any),
    }),
  ).isRequired,
}

export default LineChart

import PropTypes from 'prop-types'
import { ResponsiveTreeMap } from '@nivo/treemap'
import theme from './theme.js'

function TreeMapChart({ id, rows, identity }) {
  return (
    <ResponsiveTreeMap
      leavesOnly={true}
      data={{
        id,
        color: '#876876',
        children: rows,
      }}
      borderWidth={0}
      identity={identity}
      animate={true}
      label={identity}
      valueFormat={'>-$.2s'}
      labelSkipSize={55}
      enableParentLabel={false}
      theme={{
        ...theme,
        tooltip: {
          container: {
            backgroundColor: '#ffffff',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 5,
          },
          chip: {
            borderRadius: 5,
          },
        },
      }}
    />
  )
}

TreeMapChart.propTypes = {
  id: PropTypes.string.isRequired,
  identity: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default TreeMapChart

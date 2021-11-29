import { ResponsiveTreeMap } from '@nivo/treemap'
import PropTypes from 'prop-types'

import theme from './theme.js'

function TreeMapChart({ id, rows, identity }) {
  return (
    <ResponsiveTreeMap
      leavesOnly={true}
      data={{
        children: rows,
        color: '#876876',
        id,
      }}
      borderWidth={0}
      identity={identity}
      animate={true}
      label={identity}
      valueFormat={'>-$.2s'}
      labelSkipSize={60}
      enableParentLabel={false}
      theme={{
        ...theme,
        tooltip: {
          chip: {
            borderRadius: 5,
          },
          container: {
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: 5,
            boxShadow: 'none',
          },
        },
      }}
    />
  )
}

TreeMapChart.propTypes = {
  id: PropTypes.string.isRequired,
  identity: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
}

export default TreeMapChart

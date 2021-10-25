import PropTypes from 'prop-types'

export default PropTypes.shape({
  state: PropTypes.oneOf(['active', 'new', 'canceled']),
})

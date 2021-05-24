import PropTypes from 'prop-types'

export default PropTypes.shape({
  id: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }),
  ),
})

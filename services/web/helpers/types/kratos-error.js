import PropTypes from 'prop-types'

export default PropTypes.shape({
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ),
  id: PropTypes.string.isRequired,
})

import PropTypes from 'prop-types'

export default PropTypes.shape({
  subscription_duration: PropTypes.string.isRequired,
  subscription_group_id: PropTypes.string.isRequired,
  subscription_name: PropTypes.string.isRequired,
  subscription_package_id: PropTypes.string.isRequired,
})

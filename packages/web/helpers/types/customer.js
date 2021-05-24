import PropTypes from 'prop-types'

export const CustomerCursor = PropTypes.shape({
  subscriber_id: PropTypes.string.isRequired,
  first_interaction: PropTypes.string.isRequired,
})

export default PropTypes.shape({
  country_id: PropTypes.string.isRequired,
  device_type_id: PropTypes.string.isRequired,
  device_type_name: PropTypes.string.isRequired,
  first_interaction: PropTypes.string.isRequired,
  provider_id: PropTypes.oneOf(['apple']).isRequired,
  subscriber_id: PropTypes.string.isRequired,
  total_base_developer_proceeds: PropTypes.string.isRequired,
  total_base_subscriber_purchase: PropTypes.string.isRequired,
})

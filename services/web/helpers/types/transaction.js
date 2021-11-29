import PropTypes from 'prop-types'

export default PropTypes.shape({
  application_id: PropTypes.string.isRequired,
  base_developer_proceeds: PropTypes.string.isRequired,
  base_subscriber_purchase: PropTypes.string.isRequired,
  country_id: PropTypes.string.isRequired,
  event_date: PropTypes.string.isRequired,
  subscriber_id: PropTypes.string.isRequired,
  subscription_package_id: PropTypes.string.isRequired,
  subscription_package_name: PropTypes.string.isRequired,
  transaction_type: PropTypes.oneOf(['renewal', 'conversion', 'refund', 'trial']).isRequired,
}).isRequired

export const TransactionCursor = PropTypes.shape({
  event_date: PropTypes.string.isRequired,
  subscriber_id: PropTypes.string.isRequired,
})

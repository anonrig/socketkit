import PropTypes from 'prop-types'

export default PropTypes.shape({
  subscription_counts: PropTypes.shape({
    at_start: PropTypes.number.isRequired,
    at_start_trial: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    current_trial: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    total_trial: PropTypes.number.isRequired,
  }),
  transaction_sums: PropTypes.shape({
    current_refund_base_developer_proceeds: PropTypes.string.isRequired,
    current_total_base_developer_proceeds: PropTypes.string.isRequired,
  }),
})

import PropTypes from 'prop-types'

export default PropTypes.shape({
  account_id: PropTypes.string.isRequired,
  application_id: PropTypes.string.isRequired,
  client_id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  session_started_at: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
}).isRequired

export const EventCursor = PropTypes.shape({
  created_at: PropTypes.string.isRequired,
})
